const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaWebhook.controller');
const verifyMetaSignature = require('../middlewares/metaSignature');

// GET: Verificación de Webhook por Meta
router.get('/', metaController.verifyWebhook);

// POST: Recepción de eventos de mensajes (Messenger, Instagram)
router.post('/', verifyMetaSignature, metaController.handleIncomingEvent);

module.exports = router;
