const config = require('../config/env');

async function sendMetaGraphMessage(recipientId, messageText) {
  if (!config.META_ACCESS_TOKEN) {
    console.warn('[Meta Graph Service] META_ACCESS_TOKEN no configurado.');
    return false;
  }

  try {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${config.META_ACCESS_TOKEN}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Meta Graph Error Response]', data);
      return false;
    }

    console.log(`[Meta Graph Success] Mensaje enviado a ${recipientId}: ${data.message_id || 'OK'}`);
    return true;
  } catch (error) {
    console.error('[Meta Graph Send Exception]', error.message);
    return false;
  }
}

async function sendWhatsAppInteractiveMessage(toPhone, interactivePayload) {
  if (!config.META_ACCESS_TOKEN || !config.WHATSAPP_PHONE_NUMBER_ID) {
    console.warn('[Meta WhatsApp Cloud API] Falta META_ACCESS_TOKEN o WHATSAPP_PHONE_NUMBER_ID.');
    return false;
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const cleanPhone = String(toPhone).replace(/[^0-9]/g, '');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        ...interactivePayload
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[WhatsApp Cloud API Error]', data);
      return false;
    }

    console.log(`[WhatsApp Cloud API Success] Mensaje interactivo enviado a ${cleanPhone}`);
    return true;
  } catch (error) {
    console.error('[WhatsApp Cloud Send Exception]', error.message);
    return false;
  }
}

module.exports = {
  sendMetaGraphMessage,
  sendWhatsAppInteractiveMessage
};
