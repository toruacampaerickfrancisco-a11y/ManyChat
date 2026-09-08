const { prisma } = require('../config/database');

// Memoria fallback si la base de datos no está disponible
let inMemoryLeads = [
  {
    id: 1,
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

async function getLeads(req, res) {
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
      return res.json(leads);
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

async function addHumanMessage(req, res) {
  const { id } = req.params;
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Mensaje requerido' });

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
      return res.json({ success: true, conversation: conv });
    }
  } catch (e) {}

  const lead = inMemoryLeads.find(l => String(l.id) === String(id));
  if (lead) {
    const conv = { id: Date.now(), message, sender: 'human', timestamp: new Date() };
    lead.conversations.push(conv);
    return res.json({ success: true, conversation: conv });
  }
  res.status(404).json({ error: 'Lead no encontrado' });
}

module.exports = {
  getLeads,
  getLeadById,
  togglePause,
  addHumanMessage
};
