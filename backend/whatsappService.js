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
      printQRInTerminal: false,
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
        console.log(`[WhatsApp] Conexión cerrada (Código: ${statusCode}). Reconectar: ${shouldReconnect}`);
        
        if (!shouldReconnect) {
          connectionStatus = 'DISCONNECTED';
          qrCodeDataUrl = null;
          connectedNumber = null;
          activePairingCode = null;
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
          const senderName = msg.pushName || 'Usuario WhatsApp';
          const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

          if (text && from && !from.includes('@g.us') && messageHandler) {
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

async function sendWhatsAppDirectMessage(to, text) {
  if (!sock || connectionStatus !== 'CONNECTED') {
    return { success: false, reason: 'WhatsApp no está conectado' };
  }

  try {
    let jid = to;
    if (!jid.includes('@s.whatsapp.net')) {
      const cleanPhone = String(to).replace(/[^0-9]/g, '');
      jid = `${cleanPhone}@s.whatsapp.net`;
    }

    await sock.sendMessage(jid, { text });
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
