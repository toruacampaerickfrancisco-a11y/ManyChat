const { prisma } = require('../config/database');
const { getMetaAccessToken, sendMetaGraphMessage } = require('../services/metaGraphService');

// Memoria fallback inicializada con las conversaciones oficiales
let inMemoryLeads = [
  {
    id: 1,
    name: 'Erick TC',
    platform: 'messenger',
    phone_or_id: '27506377415723137',
    email: '27506377415723137@facebook.com',
    status: 'EN_CONTACTO',
    bot_paused: false,
    conversations: [
      { id: 2, message: 'Hola', sender: 'user', timestamp: new Date() },
      { id: 3, message: '¡Hola! Soy Nikola, tu asistente ¿En qué te puedo ayudar hoy?\n\n1️⃣ Cursos pregrabados\n2️⃣ Cursos en tiempo real por Teams\n3️⃣ Cursos presenciales\n4️⃣ Cotización de proyectos', sender: 'ai', timestamp: new Date() }
    ],
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Ing. Carlos Mendoza',
    platform: 'whatsapp',
    phone_or_id: '526621234567',
    email: 'carlos.mendoza@constructora.mx',
    status: 'EN_CONTACTO',
    bot_paused: false,
    conversations: [
      { id: 1, message: 'Hola, buenas tardes. Me interesa información sobre el curso de Concurso de Obra para Líneas de Distribución.', sender: 'user', timestamp: new Date() }
    ],
    updatedAt: new Date()
  }
];

// Sincronizar conversaciones reales de Facebook Graph API automáticamente
async function syncMetaConversations() {
  try {
    const token = await getMetaAccessToken();
    if (!token) return;

    const res = await fetch(`https://graph.facebook.com/v21.0/me/conversations?fields=id,snippet,updated_time,participants,messages{id,message,from,created_time}&access_token=${token}`);
    if (!res.ok) return;

    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) return;

    for (const conv of json.data) {
      const otherParticipant = conv.participants?.data?.find(p => p.name !== 'Clipop');
      if (!otherParticipant) continue;

      const psid = String(otherParticipant.id);
      const name = otherParticipant.name || 'Usuario Facebook';
      const messages = (conv.messages?.data || []).slice().reverse().map((m, idx) => ({
        id: m.id || idx,
        message: m.message,
        sender: m.from?.name === 'Clipop' ? (m.message.includes('Nikola') ? 'ai' : 'human') : 'user',
        timestamp: new Date(m.created_time)
      })).filter(m => m.message && m.message.trim() !== '');

      let lead = inMemoryLeads.find(l => String(l.phone_or_id) === psid);
      if (!lead) {
        lead = {
          id: inMemoryLeads.length + 10,
          name,
          platform: 'messenger',
          phone_or_id: psid,
          email: otherParticipant.email || '',
          status: 'EN_CONTACTO',
          bot_paused: false,
          conversations: messages,
          updatedAt: new Date(conv.updated_time)
        };
        inMemoryLeads.unshift(lead);
      } else {
        lead.name = name;
        if (messages.length > 0) lead.conversations = messages;
        lead.updatedAt = new Date(conv.updated_time);
      }
    }
  } catch (err) {
    console.warn('[Sync Meta Conversations Warning]', err.message);
  }
}

// Iniciar sincronización de conversaciones reales al arrancar el backend
syncMetaConversations().catch(() => {});

async function getLeads(req, res) {
  // Sincronizar en segundo plano conversaciones reales de Facebook
  syncMetaConversations().catch(() => {});
  try {
    if (prisma) {
      const leads = await prisma.lead.findMany({
        include: {
          conversations: {
            orderBy: { timestamp: 'asc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      if (leads && leads.length > 0) {
        return res.json(leads);
      }
    }
  } catch (error) {
    console.warn('[Leads Controller Warning]', error.message);
  }
  res.json(inMemoryLeads);
}

async function getLeadById(req, res) {
  const { id } = req.params;
  try {
    if (prisma) {
      const lead = await prisma.lead.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          conversations: {
            orderBy: { timestamp: 'asc' }
          }
        }
      });
      if (lead) return res.json(lead);
    }
  } catch (e) {}

  const lead = inMemoryLeads.find(l => String(l.id) === String(id));
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });
  res.json(lead);
}

async function togglePause(req, res) {
  const { id } = req.params;
  const { bot_paused } = req.body;

  try {
    if (prisma) {
      const updated = await prisma.lead.update({
        where: { id: parseInt(id, 10) },
        data: { bot_paused: Boolean(bot_paused) }
      });
      return res.json({ success: true, lead: updated });
    }
  } catch (e) {}

  const lead = inMemoryLeads.find(l => String(l.id) === String(id));
  if (lead) {
    lead.bot_paused = Boolean(bot_paused);
    return res.json({ success: true, lead });
  }
  res.status(404).json({ error: 'Lead no encontrado' });
}

async function changeStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Estado requerido' });

  try {
    if (prisma) {
      const updated = await prisma.lead.update({
        where: { id: parseInt(id, 10) },
        data: { status }
      });
      return res.json({ success: true, lead: updated });
    }
  } catch (e) {}

  const lead = inMemoryLeads.find(l => String(l.id) === String(id));
  if (lead) {
    lead.status = status;
    return res.json({ success: true, lead });
  }
  res.status(404).json({ error: 'Lead no encontrado' });
}

async function addHumanMessage(req, res) {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Mensaje requerido' });

  let lead = null;
  try {
    if (prisma) {
      lead = await prisma.lead.findUnique({ where: { id: parseInt(id, 10) } });
    }
  } catch (e) {}

  if (!lead) {
    lead = inMemoryLeads.find(l => String(l.id) === String(id));
  }

  if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });

  // 1. Envío en vivo a Meta Graph API si es Messenger, Facebook, Instagram o WhatsApp
  let isDelivered = false;
  const platform = (lead.platform || '').toLowerCase();
  try {
    if (platform === 'facebook' || platform === 'messenger' || platform === 'instagram') {
      console.log(`[Human Agent Message] Enviando a Meta Messenger PSID: ${lead.phone_or_id}...`);
      isDelivered = await sendMetaGraphMessage(lead.phone_or_id, message, platform);
    } else if (platform === 'whatsapp') {
      console.log(`[Human Agent Message] Enviando a WhatsApp: ${lead.phone_or_id}...`);
      isDelivered = await sendMetaGraphMessage(lead.phone_or_id, message, 'whatsapp');
    }
  } catch (metaErr) {
    console.error('[Meta Live Send Error]', metaErr.message);
  }

  // 2. Persistir en base de datos
  try {
    if (prisma) {
      const leadId = parseInt(id, 10);
      const conv = await prisma.conversation.create({
        data: {
          leadId,
          message,
          sender: 'human'
        }
      });
      // Pausar bot para que el asesor humano tenga el control y actualizar timestamp
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          bot_paused: true,
          updatedAt: new Date()
        }
      });
      // Sincronizar también en memoria
      const memLead = inMemoryLeads.find(l => l.id === leadId || String(l.phone_or_id) === String(lead.phone_or_id));
      if (memLead) {
        memLead.conversations = memLead.conversations || [];
        memLead.conversations.push({
          id: conv.id,
          message,
          sender: 'human',
          timestamp: conv.timestamp || new Date()
        });
        memLead.bot_paused = true;
        memLead.updatedAt = new Date();
      }
      return res.json({ success: true, conversation: conv, delivered: isDelivered });
    }
  } catch (e) {
    console.warn('[Prisma Add Message Error]', e.message);
  }

  const conv = { id: Date.now(), message, sender: 'human', timestamp: new Date() };
  lead.conversations = lead.conversations || [];
  lead.conversations.push(conv);
  lead.bot_paused = true;
  lead.updatedAt = new Date();
  return res.json({ success: true, conversation: conv, delivered: isDelivered });
}

async function recordIncomingLeadMessage({ platform, phoneOrId, name, text }) {
  let lead = null;
  const cleanPhone = String(phoneOrId);

  // 1. Prisma
  if (prisma) {
    try {
      lead = await prisma.lead.upsert({
        where: { phone_or_id: cleanPhone },
        update: {
          name: name || undefined,
          updatedAt: new Date()
        },
        create: {
          platform: platform === 'whatsapp' ? 'whatsapp' : (platform === 'instagram' ? 'instagram' : 'messenger'),
          phone_or_id: cleanPhone,
          name: name || `Usuario ${platform}`,
          status: 'NUEVO'
        }
      });

      await prisma.conversation.create({
        data: {
          leadId: lead.id,
          message: text,
          sender: 'user',
          timestamp: new Date()
        }
      });
    } catch (err) {
      console.warn('[Prisma recordIncoming Warning]', err.message);
    }
  }

  // 2. Sincronización continua en memoria
  let memLead = inMemoryLeads.find(l => String(l.phone_or_id) === cleanPhone);
  if (!memLead) {
    memLead = {
      id: lead ? lead.id : Date.now(),
      platform: platform === 'whatsapp' ? 'whatsapp' : (platform === 'instagram' ? 'instagram' : 'messenger'),
      phone_or_id: cleanPhone,
      name: name || `Usuario ${platform}`,
      email: '',
      status: 'NUEVO',
      bot_paused: false,
      conversations: [],
      updatedAt: new Date()
    };
    inMemoryLeads.unshift(memLead);
  } else {
    if (name) memLead.name = name;
  }
  memLead.conversations = memLead.conversations || [];
  memLead.conversations.push({
    id: Date.now(),
    message: text,
    sender: 'user',
    timestamp: new Date()
  });
  memLead.updatedAt = new Date();

  return lead || memLead;
}

async function recordAiResponseMessage({ phoneOrId, text }) {
  const cleanPhone = String(phoneOrId);
  if (prisma) {
    try {
      const lead = await prisma.lead.findUnique({ where: { phone_or_id: cleanPhone } });
      if (lead) {
        await prisma.conversation.create({
          data: {
            leadId: lead.id,
            message: text,
            sender: 'ai',
            timestamp: new Date()
          }
        });
      }
    } catch (err) {}
  }

  let memLead = inMemoryLeads.find(l => String(l.phone_or_id) === cleanPhone);
  if (memLead) {
    memLead.conversations = memLead.conversations || [];
    memLead.conversations.push({
      id: Date.now(),
      message: text,
      sender: 'ai',
      timestamp: new Date()
    });
    memLead.updatedAt = new Date();
  }
}

module.exports = {
  getLeads,
  getLeadById,
  togglePause,
  changeStatus,
  addHumanMessage,
  recordIncomingLeadMessage,
  recordAiResponseMessage
};
