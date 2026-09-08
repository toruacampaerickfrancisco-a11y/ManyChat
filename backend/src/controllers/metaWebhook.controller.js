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
  if (body.object === 'page' || body.object === 'instagram') {
    (body.entry || []).forEach(entry => {
      const webhookEvent = entry.messaging ? entry.messaging[0] : null;
      if (!webhookEvent || !webhookEvent.message) return;

      const senderPsid = webhookEvent.sender.id;
      const mid = webhookEvent.message.mid;
      const text = webhookEvent.message.text || '';

      // Deduplicar
      if (isDuplicate(mid)) {
        console.log(`[Meta Deduplicator] Mensaje duplicado ignorado: ${mid}`);
        return;
      }

      // Procesar en segundo plano de forma asíncrona
      processMetaMessageAsync({ senderPsid, text, platform: body.object, mid }).catch(err => {
        console.error('[Meta Async Processing Error]', err);
      });
    });
  }
}

async function processMetaMessageAsync({ senderPsid, text, platform, mid }) {
  console.log(`[Meta Event Ingesta] De ${senderPsid} (${platform}): "${text}"`);
  if (!text) return;

  let lead = null;
  try {
    if (prisma) {
      lead = await prisma.lead.upsert({
        where: { phone_or_id: senderPsid },
        update: {},
        create: {
          platform: platform === 'instagram' ? 'instagram' : 'messenger',
          phone_or_id: senderPsid,
          name: `Usuario ${platform}`
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

  // Invocar al Agente de IA
  const agentResponse = await agentOrchestrator.processMessage({
    leadId: lead ? lead.id : null,
    platform: platform === 'instagram' ? 'instagram' : 'messenger',
    phoneOrId: senderPsid,
    senderName: '',
    userMessage: text
  });

  if (agentResponse && agentResponse.text) {
    console.log(`[Meta Agent Response] Enviando respuesta a ${senderPsid}: "${agentResponse.text.substring(0, 60)}..."`);
    await sendMetaGraphMessage(senderPsid, agentResponse.text);

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
