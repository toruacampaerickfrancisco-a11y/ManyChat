const config = require('../config/env');
const { prisma } = require('../config/database');
const agentOrchestrator = require('../agent/agentCore');
const { sendMetaGraphMessage } = require('../services/metaGraphService');

// Caché TTL en memoria para deduplicar mensajes de Meta
const processedMids = new Map();
function isDuplicate(mid) {
  if (!mid) return false;
  if (processedMids.has(mid)) return true;
  processedMids.set(mid, Date.now());
  if (processedMids.size > 1000) {
    const now = Date.now();
    for (const [k, v] of processedMids.entries()) {
      if (now - v > 60000) processedMids.delete(k);
    }
  }
  return false;
}

// 1. Verificación GET de Webhook (cumplimiento estricto con Meta for Developers)
function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === config.META_VERIFY_TOKEN) {
      console.log('[Meta Webhook] ¡Webhook verificado exitosamente por Meta!');
      return res.status(200).send(challenge);
    } else {
      console.warn(`[Meta Webhook Token Mismatch] Recibido: "${token}" vs Esperado: "${config.META_VERIFY_TOKEN}"`);
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
}

// 2. Ingesta Asíncrona POST (< 500ms HTTP 200)
function handleIncomingEvent(req, res) {
  // Responder inmediatamente a Meta para cumplir el SLA
  res.status(200).send('EVENT_RECEIVED');

  const body = req.body;

  // A. Eventos de WhatsApp Cloud API (whatsapp_business_account)
  if (body.object === 'whatsapp_business_account') {
    (body.entry || []).forEach(entry => {
      (entry.changes || []).forEach(change => {
        const value = change.value;
        if (value && value.messages && value.messages.length > 0) {
          const msg = value.messages[0];
          const senderPhone = msg.from;
          const mid = msg.id;
          const senderName = (value.contacts && value.contacts[0]?.profile?.name) || '';

          let text = '';
          if (msg.type === 'text') {
            text = msg.text?.body || '';
          } else if (msg.type === 'interactive') {
            text = msg.interactive?.button_reply?.id || msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.id || '';
          } else if (msg.type === 'button') {
            text = msg.button?.text || msg.button?.payload || '';
          }

          if (isDuplicate(mid)) return;

          processMetaMessageAsync({
            senderPsid: senderPhone,
            text,
            platform: 'whatsapp',
            senderName,
            mid
          }).catch(err => console.error('[WhatsApp Cloud Async Error]', err));
        }
      });
    });
    return;
  }

  // B. Eventos de Messenger y Facebook Page
  if (body.object === 'page' || body.object === 'instagram') {
    (body.entry || []).forEach(entry => {
      const webhookEvent = entry.messaging ? entry.messaging[0] : null;
      if (!webhookEvent) return;

      const senderPsid = webhookEvent.sender.id;
      let text = '';
      let mid = '';

      if (webhookEvent.message) {
        mid = webhookEvent.message.mid;
        text = webhookEvent.message.quick_reply?.payload || webhookEvent.message.text || '';
      } else if (webhookEvent.postback) {
        mid = 'pb_' + Date.now();
        text = webhookEvent.postback.payload || webhookEvent.postback.title || '';
      }

      if (isDuplicate(mid)) {
        console.log(`[Meta Deduplicator] Mensaje duplicado ignorado: ${mid}`);
        return;
      }

      processMetaMessageAsync({
        senderPsid,
        text,
        platform: body.object,
        senderName: '',
        mid
      }).catch(err => {
        console.error('[Meta Async Processing Error]', err);
      });
    });
  }
}

async function processMetaMessageAsync({ senderPsid, text, platform, senderName = '', mid }) {
  console.log(`[Meta Event Ingesta] De ${senderPsid} (${platform}): "${text}"`);
  if (!text) return;

  const cleanText = text.trim().toLowerCase();

  let lead = null;
  try {
    if (prisma) {
      lead = await prisma.lead.upsert({
        where: { phone_or_id: senderPsid },
        update: { name: senderName || undefined },
        create: {
          platform: platform === 'whatsapp' ? 'whatsapp' : (platform === 'instagram' ? 'instagram' : 'messenger'),
          phone_or_id: senderPsid,
          name: senderName || `Usuario ${platform}`
        }
      });

      await prisma.conversation.create({
        data: {
          leadId: lead.id,
          message: text,
          sender: 'user'
        }
      });
    }
  } catch (dbErr) {
    console.warn('[Meta DB Lead Warning]', dbErr.message);
  }

  // Verificar si el bot está pausado para este lead
  if (lead && lead.bot_paused) {
    console.log(`[Meta Bot] Bot pausado para el lead #${lead.id}. Mensaje listo para operador humano.`);
    return;
  }

  // 1. Mapeo de botones interactivos al flujo unificado oficial
  let effectiveMessage = text;
  if (cleanText === 'btn_cursos' || cleanText === 'btn_cursos_opus') {
    effectiveMessage = '1';
  } else if (cleanText === 'btn_teams') {
    effectiveMessage = '2';
  } else if (cleanText === 'btn_presencial') {
    effectiveMessage = '3';
  } else if (cleanText === 'btn_cotizar') {
    effectiveMessage = '4';
  } else if (cleanText === 'btn_asesor') {
    effectiveMessage = 'asesor';
  }

  // 2. Procesar con el Agente de IA Omnicanal (Menús y Reglas Oficiales de CLIPOP)
  const agentResponse = await agentOrchestrator.processMessage({
    leadId: lead ? lead.id : null,
    platform: platform === 'whatsapp' ? 'whatsapp' : (platform === 'instagram' ? 'instagram' : 'messenger'),
    phoneOrId: senderPsid,
    senderName,
    userMessage: effectiveMessage
  });

  if (agentResponse && agentResponse.text) {
    console.log(`[Meta Agent Response] Enviando respuesta a ${senderPsid} (${platform}): "${agentResponse.text.substring(0, 60)}..."`);
    await sendMetaGraphMessage(senderPsid, agentResponse.text, platform);

    // Guardar respuesta de IA en historial
    if (prisma && lead) {
      try {
        await prisma.conversation.create({
          data: {
            leadId: lead.id,
            message: agentResponse.text,
            sender: 'ai'
          }
        });
      } catch (err) {}
    }
  }
}

module.exports = {
  verifyWebhook,
  handleIncomingEvent
};
