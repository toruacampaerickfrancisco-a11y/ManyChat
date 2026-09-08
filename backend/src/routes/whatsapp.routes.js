const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsapp.controller');

router.get('/status', whatsappController.getStatus);
router.get('/qr', whatsappController.getQr);
router.post('/pairing-code', whatsappController.requestPairingCode);
router.post('/send', whatsappController.sendMessage);

module.exports = router;
