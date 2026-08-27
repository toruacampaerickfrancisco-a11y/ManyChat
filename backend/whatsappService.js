const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const path = require('path');
const pino = require('pino');
const fs = require('fs');

let sock = null;
let qrCodeDataUrl = null;
let connectionStatus = 'DISCONNECTED'; // 'DISCONNECTED', 'QR_READY', 'CONNECTING', 'CONNECTED'
let connectedNumber = null;
let messageHandler = null;
let activePairingCode = null;

function setMessageHandler(handler) {
  messageHandler = handler;
}

async function startWhatsAppSession() {
  try {
    const authDir = path.join(__dirname, 'auth_info_baileys');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1043857760] }));

    connectionStatus = 'CONNECTING';

    sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory: false,
      generateHighQualityLinkPreview: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        connectionStatus = 'QR_READY';
        try {
          qrCodeDataUrl = await QRCode.toDataURL(qr, { width: 300, margin: 2 });
          console.log('[WhatsApp QR] Nuevo Código QR generado para escanear');
        } catch (err) {
          console.error('[QR Generation Error]', err);
        }
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        if (!shouldReconnect) {
          console.log('[WhatsApp] Sesión previa expirada o cerrada. Limpiando credenciales para nuevo inicio limpio...');
          connectionStatus = 'DISCONNECTED';
          qrCodeDataUrl = null;
          connectedNumber = null;
          activePairingCode = null;
          try {
            if (fs.existsSync(authDir)) {
              fs.rmSync(authDir, { recursive: true, force: true });
            }
          } catch (e) {}
          setTimeout(() => {
            startWhatsAppSession();
          }, 1500);
        } else {
          connectionStatus = 'CONNECTING';
          setTimeout(() => {
            startWhatsAppSession();
          }, 3000);
        }
      } else if (connection === 'open') {
        console.log('[WhatsApp] ¡Sesión vinculada con éxito!');
        connectionStatus = 'CONNECTED';
        qrCodeDataUrl = null;
        activePairingCode = null;
        connectedNumber = sock.user?.id ? sock.user.id.split(':')[0].replace(/[^0-9]/g, '') : 'Conectado';
      }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return;

      for (const msg of messages) {
        if (!msg.key.fromMe && msg.message) {
          const from = msg.key.remoteJid;
          if (!from || from === 'status@broadcast' || from.includes('@broadcast') || from.includes('@g.us')) {
            continue;
          }

          const senderName = msg.pushName || 'Usuario WhatsApp';
          let text = '';
          const m = msg.message;

          if (m.conversation) {
            text = m.conversation;
          } else if (m.extendedTextMessage?.text) {
            text = m.extendedTextMessage.text;
          } else if (m.imageMessage?.caption) {
            text = m.imageMessage.caption;
          } else if (m.videoMessage?.caption) {
            text = m.videoMessage.caption;
          } else if (m.buttonsResponseMessage?.selectedButtonId) {
            text = m.buttonsResponseMessage.selectedButtonId;
          } else if (m.listResponseMessage?.singleSelectReply?.selectedRowId) {
            text = m.listResponseMessage.singleSelectReply.selectedRowId;
          } else if (m.templateButtonReplyMessage?.selectedId) {
            text = m.templateButtonReplyMessage.selectedId;
          } else if (m.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson) {
            try {
              const params = JSON.parse(m.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
              text = params.id || params.title || '';
            } catch (e) {}
          }

          text = (text || '').trim();

          if (text && messageHandler) {
            console.log(`[WhatsApp Mensaje Entrada] De: ${senderName} (${from}) | Mensaje: "${text}"`);
            try {
              await messageHandler({ from, senderName, text, sock });
            } catch (err) {
              console.error('[WhatsApp Message Handler Error]', err);
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('[WhatsApp Session Start Error]', error);
    connectionStatus = 'DISCONNECTED';
  }
}

async function requestPairingCodeForPhone(phoneNumber) {
  try {
    const cleanPhone = String(phoneNumber).replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      return { success: false, error: 'Número de teléfono inválido' };
    }

    if (!sock) {
      await startWhatsAppSession();
      // Esperar breve conexión de socket
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    const code = await sock.requestPairingCode(cleanPhone);
    activePairingCode = code;
    return { success: true, code, phone: cleanPhone };
  } catch (error) {
    console.error('[Pairing Code Error]', error);
    return { success: false, error: error.message };
  }
}

function formatForWhatsApp(text) {
  if (!text) return "";
  // Transforma links markdown [Título](url) en formato limpio para WhatsApp: 👉 *Título:* \nurl
  return text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (match, title, url) => {
    return `👉 *${title}:*\n${url}`;
  });
}

async function sendWhatsAppDirectMessage(to, text) {
  if (!sock || connectionStatus !== 'CONNECTED') {
    return { success: false, reason: 'WhatsApp no está conectado' };
  }

  try {
    let jid = to;
    if (!jid.includes('@')) {
      const cleanPhone = String(to).replace(/[^0-9]/g, '');
      jid = `${cleanPhone}@s.whatsapp.net`;
    }

    const cleanText = formatForWhatsApp(text);
    await sock.sendMessage(jid, { text: cleanText });
    return { success: true };
  } catch (error) {
    console.error('[WhatsApp Direct Send Error]', error);
    return { success: false, error: error.message };
  }
}

async function logoutWhatsAppSession() {
  try {
    if (sock) {
      await sock.logout();
    }
    const authDir = path.join(__dirname, 'auth_info_baileys');
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true });
    }
    connectionStatus = 'DISCONNECTED';
    qrCodeDataUrl = null;
    connectedNumber = null;
    activePairingCode = null;
    return { success: true };
  } catch (error) {
    console.error('[WhatsApp Logout Error]', error);
    return { success: false, error: error.message };
  }
}

function getWhatsAppStatus() {
  return {
    status: connectionStatus,
    qr: qrCodeDataUrl,
    pairingCode: activePairingCode,
    connectedNumber
  };
}

module.exports = {
  startWhatsAppSession,
  requestPairingCodeForPhone,
  setMessageHandler,
  sendWhatsAppDirectMessage,
  logoutWhatsAppSession,
  getWhatsAppStatus
};
