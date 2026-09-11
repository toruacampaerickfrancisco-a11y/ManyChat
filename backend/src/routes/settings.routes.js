const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');

// Settings
router.get('/settings', settingsController.getSettings);
router.post('/settings', settingsController.updateSettings);

// Bot Flow Studio & Core Flows
router.get('/bot/flows', settingsController.getBotFlows);
router.post('/bot/flows/save-core', settingsController.saveCoreFlow);
router.post('/bot/flows/reset-core', settingsController.resetCoreFlow);

// Custom Rules
router.get('/rules', settingsController.getRules);
router.post('/rules', settingsController.createRule);
router.delete('/rules/:id', settingsController.deleteRule);

// Web Chatbot & Contact Endpoints
const agentOrchestrator = require('../agent/agentCore');

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await agentOrchestrator.processMessage({
      platform: 'web',
      userMessage: message
    });
    res.json({ reply: response.text });
  } catch (err) {
    console.error('[Web Chat Error]', err);
    res.status(500).json({ error: 'Error al procesar el mensaje.' });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    const { prisma } = require('../config/database');
    if (prisma) {
      const lead = await prisma.lead.create({
        data: {
          name: nombre,
          email: email,
          platform: 'web_contact',
          phone_or_id: email || `web_${Date.now()}`
        }
      });
      if (mensaje) {
        await prisma.conversation.create({
          data: {
            leadId: lead.id,
            message: mensaje,
            sender: 'user'
          }
        });
      }
    }
    res.json({ success: true, message: 'Mensaje recibido correctamente' });
  } catch (err) {
    console.error('[Web Contact Error]', err);
    res.json({ success: true, message: 'Mensaje recibido' });
  }
});

module.exports = router;

