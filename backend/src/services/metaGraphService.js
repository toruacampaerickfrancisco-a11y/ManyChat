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

module.exports = {
  sendMetaGraphMessage
};
