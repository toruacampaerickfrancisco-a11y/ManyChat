const { prisma } = require('../config/database');
const { DEFAULT_PRODUCTS } = require('../config/constants');
const whatsappService = require('../services/baileysService');
const config = require('../config/env');
const fs = require('fs');
const path = require('path');

async function getDashboardStats(req, res) {
  try {
    let coursesCount = DEFAULT_PRODUCTS.length;
    let leadsCount = 0;
    let messagesCount = 0;
    let aiMessagesCount = 0;
    let leads = [];
    let recentConversations = [];

    // 1. Cursos
    try {
      if (prisma) {
        const dbProductsCount = await prisma.product.count().catch(() => 0);
        if (dbProductsCount > 0) coursesCount = dbProductsCount;
      }
    } catch (e) {}

    // 2. Leads y Conversaciones
    try {
      if (prisma) {
        leadsCount = await prisma.lead.count().catch(() => 0);
        messagesCount = await prisma.conversation.count().catch(() => 0);
        aiMessagesCount = await prisma.conversation.count({ where: { sender: 'ai' } }).catch(() => 0);

        recentConversations = await prisma.conversation.findMany({
          take: 8,
          orderBy: { timestamp: 'desc' },
          include: {
            lead: {
              select: {
                id: true,
                name: true,
                phone_or_id: true,
                platform: true
              }
            }
          }
        }).catch(() => []);
      }
    } catch (e) {}

    // 3. Archivos Multimedia
    let mediaCount = 0;
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (fs.existsSync(uploadDir)) {
      mediaCount += fs.readdirSync(uploadDir).length;
    }
    const nikolaPath = path.join(__dirname, '../../Avatar_Torre_CFE_Completo/nikola_bienvenida.mp4');
    if (fs.existsSync(nikolaPath)) mediaCount += 1;

    // 4. Estado de WhatsApp
    const waStatusData = whatsappService.getWhatsAppStatus ? whatsappService.getWhatsAppStatus() : { status: 'DISCONNECTED' };

    res.json({
      success: true,
      stats: {
        totalCourses: coursesCount,
        totalLeads: leadsCount,
        totalMessages: messagesCount,
        totalAiResponses: aiMessagesCount,
        totalMedia: mediaCount,
        whatsappStatus: waStatusData.status || 'DISCONNECTED',
        whatsappPhone: waStatusData.connectedNumber || 'No vinculado',
        geminiStatus: config.GEMINI_API_KEY ? 'OPERATIVO' : 'CLIPOP RULES',
        databaseStatus: prisma ? 'CONECTADO' : 'EN MEMORIA'
      },
      recentActivity: recentConversations.map(c => ({
        id: c.id,
        sender: c.sender,
        message: c.message,
        timestamp: c.timestamp,
        userName: c.lead?.name || c.lead?.phone_or_id || 'Cliente',
        platform: c.lead?.platform || 'whatsapp'
      }))
    });
  } catch (error) {
    console.error('[Dashboard Stats Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getDashboardStats
};
