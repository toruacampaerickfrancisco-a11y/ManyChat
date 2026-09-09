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

// --- MANEJADOR DE MENSAJES DE WHATSAPP (Baileys) ---
whatsappService.setMessageHandler(async ({ from, senderName, text, audioBuffer, imageBuffer }) => {
  const phone = from.split('@')[0];
  let userMessage = text || '';

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

  // 3. Manejo de botones de opciones rápidas y tarjetas con banner
  const cleanMsg = userMessage.trim().toLowerCase();
  const interactiveService = require('./src/services/interactiveMessageService');

  // Opción 1 o Cursos
  if (cleanMsg === '1' || cleanMsg === 'btn_cursos' || cleanMsg.includes('cursos') || cleanMsg.includes('opus')) {
    const card = interactiveService.buildCoursesCard();
    await whatsappService.sendWhatsAppBannerCard(from, {
      imageUrl: 'https://clipop.com.mx/concurso_lineas.png',
      text: card.interactive.body.text,
      buttons: [
        { text: '⚡ Cotizar Proyecto' },
        { text: '👤 Hablar con Asesor' }
      ],
      footer: 'CLIPOP Ingeniería'
    });
    return;
  }

  // Opción 2 o Cotizar
  if (cleanMsg === '2' || cleanMsg === 'btn_cotizar' || cleanMsg.includes('cotizar')) {
    const card = interactiveService.buildQuotationCard();
    await whatsappService.sendWhatsAppBannerCard(from, {
      imageUrl: 'https://clipop.com.mx/concurso_subestacion.png',
      text: card.interactive.body.text,
      buttons: [
        { text: '📚 Ver Cursos' },
        { text: '👤 Transferir a Ingeniero' }
      ],
      footer: 'CLIPOP Ingeniería'
    });
    return;
  }

  // Opción 3 o Asesor Humano
  if (cleanMsg === '3' || cleanMsg === 'btn_asesor' || cleanMsg.includes('asesor') || cleanMsg.includes('humano')) {
    if (prisma && lead) {
      await prisma.lead.update({ where: { id: lead.id }, data: { bot_paused: true } });
    }
    await whatsappService.sendWhatsAppDirectMessage(from, '👨‍💼 Un ingeniero asesor de CLIPOP tomará el control de la conversación a la brevedad. ¡Gracias por tu paciencia!');
    return;
  }

  // Saludo Inicial ("hola", "0", "inicio", "buenas") -> Tarjeta de Bienvenida con Banner de Nikola
  if (cleanMsg === 'hola' || cleanMsg === '0' || cleanMsg === 'inicio' || cleanMsg === 'buenas' || cleanMsg === 'buenos dias' || cleanMsg === 'buenas tardes') {
    const welcomeCard = interactiveService.buildWelcomeCard(senderName);
    await whatsappService.sendWhatsAppBannerCard(from, {
      imageUrl: 'https://clipop.com.mx/avatar-torre/Avatar_Torre_Estilo_Pixar.jpg',
      text: welcomeCard.interactive.body.text,
      buttons: [
        { text: '📚 Cursos OPUS / CFE' },
        { text: '⚡ Cotizar Proyecto' },
        { text: '👤 Asesor Humano' }
      ],
      footer: 'CLIPOP • clipop.com.mx'
    });
    return;
  }

  // 4. Procesar mensaje libre con el Agente de IA Omnicanal
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
    } else {
      await whatsappService.sendWhatsAppDirectMessage(from, response.text);
    }

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
