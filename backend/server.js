const config = require('./src/config/env');
const { prisma } = require('./src/config/database');
const app = require('./src/app');
const whatsappService = require('./whatsappService');
const agentOrchestrator = require('./src/agent/agentCore');
const { transcribeAudioBuffer } = require('./src/agent/multimodal/speechToText');
const { synthesizeTextToAudio } = require('./src/agent/multimodal/textToSpeech');

// --- SISTEMA ANTICAIDAS Y RESILIENCIA ---
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception] Capturado para evitar crasheo del servidor:', err.message || err);
  if (err && err.message && (err.message.includes('Bad MAC') || err.message.includes('Session error'))) {
    console.error('[WhatsApp FATAL] Corrupción detectada. Limpiando sesión...');
    try {
      const fs = require('fs');
      const path = require('path');
      const authDir = path.join(__dirname, 'auth_info_baileys');
      if (fs.existsSync(authDir)) fs.rmSync(authDir, { recursive: true, force: true });
    } catch(e) {}
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection] Promesa sin capturar:', reason);
});

// --- GESTIÓN DE INACTIVIDAD DE CHAT EN WHATSAPP ---
const inactivitySessions = new Map();

function clearInactivityTimers(userJid) {
  if (inactivitySessions.has(userJid)) {
    const session = inactivitySessions.get(userJid);
    if (session.nudgeTimer) clearTimeout(session.nudgeTimer);
    if (session.closeTimer) clearTimeout(session.closeTimer);
    inactivitySessions.delete(userJid);
  }
}

function scheduleInactivityTimers(userJid, senderName = '') {
  clearInactivityTimers(userJid);

  // 1. Mensaje de seguimiento tras 2.5 minutos de inactividad
  const nudgeTimer = setTimeout(async () => {
    try {
      const nudgeMsg = `⏰ *Hola${senderName ? ' ' + senderName : ''}*, ¿sigues por ahí? 🤔\n\n¿Te gustaría continuar con la conversación o tienes alguna otra duda sobre nuestros cursos o cotizaciones?\n\n💡 _Escribe cualquier duda o *0* para volver al menú principal._`;
      console.log(`[WhatsApp Inactividad] Enviando recordatorio a ${userJid}`);
      await whatsappService.sendWhatsAppDirectMessage(userJid, nudgeMsg);
    } catch (err) {
      console.error('[WhatsApp Nudge Error]', err);
    }
  }, 150000); // 2.5 minutos

  // 2. Mensaje de cierre tras 5 minutos de inactividad total
  const closeTimer = setTimeout(async () => {
    try {
      const closeMsg = `🔒 *Sesión finalizada por inactividad*\n\nHemos cerrado esta conversación por el momento. Puedes volver a escribirnos cuando gustes enviando *'Hola'* o *'0'*. ¡Mucho éxito en tus proyectos! 👋✨\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━`;
      console.log(`[WhatsApp Inactividad] Cerrando sesión por inactividad para ${userJid}`);
      await whatsappService.sendWhatsAppDirectMessage(userJid, closeMsg);
      inactivitySessions.delete(userJid);
    } catch (err) {
      console.error('[WhatsApp Close Error]', err);
    }
  }, 300000); // 5 minutos

  inactivitySessions.set(userJid, { nudgeTimer, closeTimer, lastActivity: Date.now() });
}

// --- MANEJADOR DE MENSAJES DE WHATSAPP (Baileys) ---
whatsappService.setMessageHandler(async ({ from, senderName, text, audioBuffer, imageBuffer }) => {
  const phone = from.split('@')[0];
  let userMessage = text || '';

  // Limpiar temporizadores de inactividad al recibir mensaje
  clearInactivityTimers(from);

  // 1. Si es audio, transcribir con Groq Whisper
  let isVoice = false;
  if (audioBuffer && !userMessage) {
    console.log(`[WhatsApp Audio] Transcribiendo nota de voz de ${senderName} (${phone})...`);
    const transcription = await transcribeAudioBuffer(audioBuffer);
    if (transcription) {
      userMessage = transcription;
      isVoice = true;
      console.log(`[WhatsApp Transcripción]: "${userMessage}"`);
    }
  }

  if (!userMessage) return;

  // 2. Registro / Actualización de Lead en Base de Datos
  let lead = null;
  try {
    if (prisma) {
      lead = await prisma.lead.upsert({
        where: { phone_or_id: phone },
        update: { name: senderName || undefined, prefers_audio: isVoice },
        create: {
          platform: 'whatsapp',
          phone_or_id: phone,
          name: senderName,
          prefers_audio: isVoice
        }
      });

      await prisma.conversation.create({
        data: {
          leadId: lead.id,
          message: userMessage,
          sender: 'user',
          media_type: isVoice ? 'audio' : 'text'
        }
      });
    }
  } catch (dbErr) {
    console.warn('[WhatsApp DB Lead Warning]', dbErr.message);
  }

  // Si el bot está en pausa humana, no responder automáticamente
  if (lead && lead.bot_paused) {
    console.log(`[WhatsApp Bot] Lead #${lead.id} está pausado para atención humana.`);
    return;
  }

  // 3. Procesar mensaje con el Agente de IA Omnicanal (Reglas Exactas de CLIPOP)
  const response = await agentOrchestrator.processMessage({
    leadId: lead ? lead.id : null,
    platform: 'whatsapp',
    phoneOrId: phone,
    senderName,
    userMessage
  });

  if (response && response.text) {
    console.log(`[WhatsApp Bot Respuesta] A ${phone}: "${response.text.substring(0, 60)}..."`);
    
    // Si el usuario habló por audio, intentar responder con nota de voz nativa
    if (isVoice) {
      const voiceAudio = await synthesizeTextToAudio(response.text);
      if (voiceAudio) {
        await whatsappService.sendVoiceNote(from, voiceAudio);
      } else {
        await whatsappService.sendWhatsAppDirectMessage(from, response.text);
      }
    } else if (response.isWelcome) {
      // Si es el saludo inicial o menú de bienvenida, enviar video de Nikola con el menú
      console.log(`[WhatsApp Welcome] Enviando video de bienvenida de Nikola a ${from}...`);
      const videoResult = await whatsappService.sendWhatsAppVideoCard(from, { text: response.text });
      if (!videoResult || !videoResult.success) {
        await whatsappService.sendWhatsAppDirectMessage(from, response.text);
      }
    } else {
      await whatsappService.sendWhatsAppDirectMessage(from, response.text);
    }

    // Programar temporizadores de seguimiento por inactividad
    scheduleInactivityTimers(from, senderName);

    if (prisma && lead) {
      try {
        await prisma.conversation.create({
          data: {
            leadId: lead.id,
            message: response.text,
            sender: 'ai'
          }
        });
      } catch (err) {}
    }
  }
});

// --- INICIO DEL SERVIDOR ---
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 [CLIPOP Enterprise AI Agent] Servidor en puerto ${PORT}`);
  console.log(`📡 Modo: ${config.NODE_ENV} | Webhook Meta: /api/webhooks/meta`);
  console.log(`===================================================`);

  // Auto-iniciar sesión de WhatsApp
  whatsappService.startWhatsAppSession().catch(err => {
    console.warn('[WhatsApp AutoStart Warning]', err.message);
  });
});
