const whatsappService = require('../services/baileysService');

async function getStatus(req, res) {
  const isConnected = whatsappService.isWhatsAppConnected();
  res.json({
    connected: isConnected,
    status: isConnected ? 'CONNECTED' : 'DISCONNECTED'
  });
}

async function getQr(req, res) {
  const qrCode = whatsappService.getLatestQrCode();
  const isConnected = whatsappService.isWhatsAppConnected();
  res.json({
    qr: qrCode,
    connected: isConnected
  });
}

async function requestPairingCode(req, res) {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Se requiere el número de teléfono' });
  }

  try {
    const code = await whatsappService.requestPairingCode(phoneNumber);
    res.json({ success: true, pairingCode: code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function sendMessage(req, res) {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ error: 'Se requieren "phone" y "message"' });
  }

  try {
    const userJid = phone.includes('@s.whatsapp.net') ? phone : `${phone}@s.whatsapp.net`;
    await whatsappService.sendWhatsAppDirectMessage(userJid, message);
    res.json({ success: true, message: 'Mensaje enviado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getStatus,
  getQr,
  requestPairingCode,
  sendMessage
};
