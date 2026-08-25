const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const whatsappService = require('./whatsappService');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

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
  }, 150000); // 2.5 minutos (150 segundos)

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
  }, 300000); // 5 minutos (300 segundos)

  inactivitySessions.set(userJid, { nudgeTimer, closeTimer, lastActivity: Date.now() });
}

// Inicializar el manejador de mensajes de WhatsApp Web (Baileys)
whatsappService.setMessageHandler(async ({ from, senderName, text }) => {
  console.log(`[WhatsApp Entrada] de ${senderName} (${from}): ${text}`);
  const phone = from.split('@')[0];

  // Limpiar temporizadores anteriores al recibir cualquier mensaje
  clearInactivityTimers(from);

  let lead = null;
  try {
    if (process.env.DATABASE_URL) {
      lead = await prisma.lead.upsert({
        where: { phone_or_id: phone },
        update: { name: senderName || undefined },
        create: {
          platform: 'whatsapp',
          phone_or_id: phone,
          name: senderName
        }
      });

      await prisma.conversation.create({
        data: {
          leadId: lead.id,
          message: text,
          sender: 'user'
        }
      });
    }
  } catch (dbErr) {
    console.warn('[WhatsApp DB Lead Warning]', dbErr.message);
  }

  if (!lead) {
    lead = inMemoryLeads.find(l => l.phone_or_id === phone);
    if (!lead) {
      lead = {
        id: inMemoryLeads.length + 101,
        name: senderName || `WhatsApp ${phone}`,
        platform: 'whatsapp',
        phone_or_id: phone,
        email: '',
        status: 'NUEVO',
        bot_paused: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        conversations: []
      };
      inMemoryLeads.push(lead);
    }
    lead.conversations.push({
      id: lead.conversations.length + 1,
      leadId: lead.id,
      message: text,
      sender: 'user',
      timestamp: new Date().toISOString()
    });
  }

  // Si el bot no está pausado para este lead, generar y enviar respuesta inmediata
  const isPaused = lead ? lead.bot_paused : false;
  if (!isPaused) {
    const reply = await generateAiReply(text);

    try {
      if (process.env.DATABASE_URL && lead && typeof lead.id === 'string') {
        await prisma.conversation.create({
          data: {
            leadId: lead.id,
            message: reply,
            sender: 'ai'
          }
        });
      } else if (lead && lead.conversations) {
        lead.conversations.push({
          id: lead.conversations.length + 1,
          leadId: lead.id,
          message: reply,
          sender: 'ai',
          timestamp: new Date().toISOString()
        });
      }
    } catch (saveErr) {
      console.warn('[WhatsApp DB Reply Save Warning]', saveErr.message);
    }

    // Enviar respuesta directa e inmediata a WhatsApp
    const sendRes = await whatsappService.sendWhatsAppDirectMessage(from, reply);
    console.log(`[WhatsApp Salida Enviada] a ${from} | Éxito: ${sendRes.success}`);

    // Programar recordatorio de inactividad y cierre a los 5 minutos (si no fue una despedida explícita)
    const cleanText = (text || '').toLowerCase().trim();
    if (cleanText !== 'no' && cleanText !== 'adios' && cleanText !== 'adiós') {
      scheduleInactivityTimers(from, senderName);
    }
  }
});


// Middlewares
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Backend Activo' });
});

// We will mount our routes here once the database is connected
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/products', require('./routes/products'));

// --- RUTAS Y MOTOR PARA BOT, LIVE CHAT Y LEADS ESTILO MANYCHAT ---

const DEFAULT_SYSTEM_PROMPT = `Eres el asistente virtual oficial de CLIPOP (Ingeniería de Costos, Consultoría y Licitaciones, fundada por el Ing. Francisco Gardea).
Debes responder de forma concisa, cordial, precisa y profesional siguiendo exactamente la oferta de servicios y enlaces oficiales de CLIPOP:

1. SERVICIOS PRINCIPALES:
   - 1️⃣ Cursos pregrabados: Disponibles en la plataforma Udemy.
     * Curso Gratuito Introductorio: https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED
     * Precios Unitarios OPUS 22, 24, Neodata y Excel: https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/
     * Cómo Presentar Concursos para CFE (OPUS 2020): https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/
     * Análisis de Precios Unitarios 100% Práctico (OPUS 2025): https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F
     * Catálogo completo en web: https://clipop.com.mx/cursos
     * Cupones de descuento: escribir a clipopoficial@gmail.com
   - 2️⃣ Cursos virtuales en tiempo real: Impartidos mediante Microsoft Teams. Las convocatorias se publican en redes sociales, o pueden programar un curso en una fecha específica escribiendo a clipopoficial@gmail.com.
   - 3️⃣ Cursos presenciales: Abiertos al público en la ciudad de Hermosillo, Sonora. Convocatorias con fechas y horarios en redes sociales. Para cursos en otras ciudades de México, escribir a clipopoficial@gmail.com.
   - 4️⃣ Cotización de proyectos de media o alta tensión: Para cotizar un proyecto, solicitar enviar la información del proyecto, catálogo, especificaciones, planos y condiciones comerciales a clipopoficial@gmail.com con el asunto "solicitud de cotizacion".

2. ENLACES Y REDES SOCIALES:
   - 🌐 Sitio Web Oficial: https://clipop.com.mx
   - 📸 Instagram Oficial: https://www.instagram.com/clipopoficial/
   - 🔵 Facebook Oficial: https://www.facebook.com/profile.php?id=61591801231145
   - 🟢 WhatsApp Directo: https://wa.me/526624745958
   - ✉️ Correo Oficial: clipopoficial@gmail.com

3. NAVEGACIÓN Y CIERRE:
   - Al responder sobre cualquier servicio, incluye siempre los enlaces a redes y sitio web, pregunta: "¿Tienes alguna otra duda?" e indica: "💡 Escribe 0 o 'menu' para volver al menú principal."
   - Si el usuario dice que "Sí", indícale las opciones para orientarle.
   - Si el usuario dice que "No", despídete con: "¡Fue un placer atenderte! Recuerda seguirnos en nuestras redes, ¡mucho éxito!".`;

let inMemoryBotRules = [
  // Flujo 0: Bienvenida y Menú Principal (incluyendo '0', 'menu', 'hola', 'inicio', 'volver')
  {
    id: 1,
    keyword: "menu",
    match_type: "exact",
    response: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\n*¿En cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._",
    is_active: true
  },
  {
    id: 2,
    keyword: "hola",
    match_type: "exact",
    response: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\n*¿En cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._",
    is_active: true
  },
  {
    id: 3,
    keyword: "inicio",
    match_type: "exact",
    response: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\n*¿En cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._",
    is_active: true
  },
  {
    id: 4,
    keyword: "0",
    match_type: "exact",
    response: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\n*¿En cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._",
    is_active: true
  },
  {
    id: 5,
    keyword: "volver",
    match_type: "exact",
    response: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte.\n\n*¿En cuál de nuestros servicios estás interesado?*\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos en tiempo real por Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe tu duda._",
    is_active: true
  },

  // Flujo 1: Cursos pregrabados (Udemy)
  {
    id: 6,
    keyword: "1",
    match_type: "exact",
    response: "¡Excelente! 🎓 Actualmente contamos con los siguientes cursos especializados en *Udemy*:\n\n1️⃣ *Curso Gratuito Introductorio:*\n👉 https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED\n\n2️⃣ *Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel:*\n👉 https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/\n\n3️⃣ *Cómo Presentar Concursos para CFE desde cero (OPUS 2020):*\n👉 https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/\n\n4️⃣ *Análisis de Precios Unitarios 100% Práctico (OPUS 2025):*\n👉 https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F\n\n🌐 *Ver todos en la plataforma:* https://clipop.com.mx/cursos\n🎁 *Cupones de descuento:* Escríbenos a *clipopoficial@gmail.com*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },
  {
    id: 7,
    keyword: "pregrabados",
    match_type: "contains",
    response: "¡Excelente! 🎓 Actualmente contamos con los siguientes cursos especializados en *Udemy*:\n\n1️⃣ *Curso Gratuito Introductorio:*\n👉 https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED\n\n2️⃣ *Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel:*\n👉 https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/\n\n3️⃣ *Cómo Presentar Concursos para CFE desde cero (OPUS 2020):*\n👉 https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/\n\n4️⃣ *Análisis de Precios Unitarios 100% Práctico (OPUS 2025):*\n👉 https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F\n\n🌐 *Ver todos en la plataforma:* https://clipop.com.mx/cursos\n🎁 *Cupones de descuento:* Escríbenos a *clipopoficial@gmail.com*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },
  {
    id: 8,
    keyword: "udemy",
    match_type: "contains",
    response: "¡Excelente! 🎓 Actualmente contamos con los siguientes cursos especializados en *Udemy*:\n\n1️⃣ *Curso Gratuito Introductorio:*\n👉 https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED\n\n2️⃣ *Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel:*\n👉 https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/\n\n3️⃣ *Cómo Presentar Concursos para CFE desde cero (OPUS 2020):*\n👉 https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/\n\n4️⃣ *Análisis de Precios Unitarios 100% Práctico (OPUS 2025):*\n👉 https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F\n\n🌐 *Ver todos en la plataforma:* https://clipop.com.mx/cursos\n🎁 *Cupones de descuento:* Escríbenos a *clipopoficial@gmail.com*\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },

  // Flujo 2: Cursos en tiempo real (Teams)
  {
    id: 9,
    keyword: "2",
    match_type: "exact",
    response: "Te invitamos a seguir nuestras redes oficiales, donde publicamos las convocatorias para los cursos en tiempo real vía *Microsoft Teams* 💻:\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n📅 Si deseas programar un curso exclusivo en una fecha específica, envíanos un correo a:\n✉️ *clipopoficial@gmail.com*\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },
  {
    id: 10,
    keyword: "teams",
    match_type: "contains",
    response: "Te invitamos a seguir nuestras redes oficiales, donde publicamos las convocatorias para los cursos en tiempo real vía *Microsoft Teams* 💻:\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n📅 Si deseas programar un curso exclusivo en una fecha específica, envíanos un correo a:\n✉️ *clipopoficial@gmail.com*\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },
  {
    id: 11,
    keyword: "tiempo real",
    match_type: "contains",
    response: "Te invitamos a seguir nuestras redes oficiales, donde publicamos las convocatorias para los cursos en tiempo real vía *Microsoft Teams* 💻:\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n📅 Si deseas programar un curso exclusivo en una fecha específica, envíanos un correo a:\n✉️ *clipopoficial@gmail.com*\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },

  // Flujo 3: Cursos presenciales (Hermosillo y otras ciudades)
  {
    id: 12,
    keyword: "3",
    match_type: "exact",
    response: "¡Excelente! 📍 Los cursos presenciales abiertos al público se imparten en la ciudad de *Hermosillo, Sonora*.\n\nEn nuestras redes sociales damos a conocer las próximas convocatorias, fechas y horarios:\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n🏢 Si te interesa un curso presencial en otra ciudad de la República Mexicana, escríbenos a:\n✉️ *clipopoficial@gmail.com*\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },
  {
    id: 13,
    keyword: "presencial",
    match_type: "contains",
    response: "¡Excelente! 📍 Los cursos presenciales abiertos al público se imparten en la ciudad de *Hermosillo, Sonora*.\n\nEn nuestras redes sociales damos a conocer las próximas convocatorias, fechas y horarios:\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n🏢 Si te interesa un curso presencial en otra ciudad de la República Mexicana, escríbenos a:\n✉️ *clipopoficial@gmail.com*\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },
  {
    id: 14,
    keyword: "presenciales",
    match_type: "contains",
    response: "¡Excelente! 📍 Los cursos presenciales abiertos al público se imparten en la ciudad de *Hermosillo, Sonora*.\n\nEn nuestras redes sociales damos a conocer las próximas convocatorias, fechas y horarios:\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n🏢 Si te interesa un curso presencial en otra ciudad de la República Mexicana, escríbenos a:\n✉️ *clipopoficial@gmail.com*\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },

  // Flujo 4: Cotización de proyecto de media o alta tensión
  {
    id: 15,
    keyword: "4",
    match_type: "exact",
    response: "¡Excelente! 🤝⚡ Para nosotros será un placer hacer sinergia en tu proyecto de media o alta tensión.\n\nPor favor envíanos la información técnica del proyecto (catálogo de conceptos, especificaciones, planos y condiciones comerciales) a:\n✉️ *clipopoficial@gmail.com*\n📌 Asunto: *Solicitud de cotización*\n\nNuestro equipo de ingeniería de costos se comunicará contigo a la brevedad.\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },
  {
    id: 16,
    keyword: "cotizacion",
    match_type: "contains",
    response: "¡Excelente! 🤝⚡ Para nosotros será un placer hacer sinergia en tu proyecto de media o alta tensión.\n\nPor favor envíanos la información técnica del proyecto (catálogo de conceptos, especificaciones, planos y condiciones comerciales) a:\n✉️ *clipopoficial@gmail.com*\n📌 Asunto: *Solicitud de cotización*\n\nNuestro equipo de ingeniería de costos se comunicará contigo a la brevedad.\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },
  {
    id: 17,
    keyword: "proyecto",
    match_type: "contains",
    response: "¡Excelente! 🤝⚡ Para nosotros será un placer hacer sinergia en tu proyecto de media o alta tensión.\n\nPor favor envíanos la información técnica del proyecto (catálogo de conceptos, especificaciones, planos y condiciones comerciales) a:\n✉️ *clipopoficial@gmail.com*\n📌 Asunto: *Solicitud de cotización*\n\nNuestro equipo de ingeniería de costos se comunicará contigo a la brevedad.\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n❓ _¿Tienes alguna otra duda? (Responde 'Sí' o 'No')_\n💡 _Escribe *0* para volver al menú principal._",
    is_active: true
  },

  // Flujo: Duda adicional ("si" o "sí")
  {
    id: 18,
    keyword: "si",
    match_type: "exact",
    response: "*¿Acerca de qué servicio es tu duda?* 🤔\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos virtuales en Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe *0* para el menú principal._",
    is_active: true
  },
  {
    id: 19,
    keyword: "sí",
    match_type: "exact",
    response: "*¿Acerca de qué servicio es tu duda?* 🤔\n\n1️⃣ *Cursos pregrabados*\n2️⃣ *Cursos virtuales en Teams*\n3️⃣ *Cursos presenciales*\n4️⃣ *Cotización de proyectos de media o alta tensión*\n\n💡 _Responde con el número (1, 2, 3 o 4) o escribe *0* para el menú principal._",
    is_active: true
  },

  // Flujo: Sin dudas adicionales ("no")
  {
    id: 20,
    keyword: "no",
    match_type: "exact",
    response: "¡Fue un placer atenderte! 🚀✨\n\nRecuerda seguirnos en nuestras redes oficiales para novedades y convocatorias:\n\n━━━━━━━━━━━━━━━━━━━\n🌐 *Sitio Web:* https://clipop.com.mx\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n━━━━━━━━━━━━━━━━━━━\n\n¡Mucho éxito en tus proyectos! 🙌",
    is_active: true
  },

  // Flujo: Contacto con Asesor Humano
  {
    id: 21,
    keyword: "asesor",
    match_type: "contains",
    response: "👨‍💼 *Atención con un Asesor de CLIPOP*\n\n¡Perfecto! Hemos notificado a nuestro equipo. Si deseas contacto inmediato, puedes comunicarte por:\n\n🟢 *WhatsApp Directo:* https://wa.me/526624745958\n📸 *Instagram:* https://instagram.com/clipopoficial\n🔵 *Facebook:* https://facebook.com/profile.php?id=61591801231145\n🌐 *Sitio Web:* https://clipop.com.mx\n✉️ *Correo:* clipopoficial@gmail.com\n\n💡 _Escribe *0* o *'menu'* para volver._",
    is_active: true
  },
  {
    id: 22,
    keyword: "humano",
    match_type: "contains",
    response: "👨‍💼 *Atención con un Asesor de CLIPOP*\n\nUn asesor humano del equipo de *CLIPOP* tomará la conversación a la brevedad.\n\n🟢 *WhatsApp Directo:* https://wa.me/526624745958\n🌐 *Sitio Web:* https://clipop.com.mx\n\n💡 _Escribe *0* o *'menu'* para volver al menú principal._",
    is_active: true
  }
];

// Helper function to generate AI or rule-based bot reply with dynamic prompt and rules
async function generateAiReply(message, history = []) {
  const msg = (message || '').toLowerCase().trim();
  if (!msg) return "¡Hola! ¿En qué te podemos apoyar hoy? Escribe 'menu' para ver nuestras opciones.";

  // 1. Verificar si el bot está deshabilitado globalmente
  let botEnabled = true;
  let customPrompt = DEFAULT_SYSTEM_PROMPT;
  let rules = inMemoryBotRules;

  try {
    if (process.env.DATABASE_URL) {
      try {
        const settings = await prisma.setting.findMany({
          where: { key: { in: ['bot_enabled', 'bot_system_prompt'] } }
        });
        settings.forEach(s => {
          if (s.key === 'bot_enabled') botEnabled = s.value !== 'false';
          if (s.key === 'bot_system_prompt' && s.value.trim()) customPrompt = s.value;
        });
      } catch (e) {}

      try {
        const dbRules = await prisma.botRule.findMany({ where: { is_active: true } });
        if (dbRules && dbRules.length > 0) {
          rules = dbRules;
        }
      } catch (e) {}
    }
  } catch (err) {}

  if (!botEnabled) {
    return "En este momento nuestro bot automático se encuentra en pausa. Un asesor del equipo de CLIPOP te atenderá a la brevedad.";
  }

  // 2. Evaluar reglas de palabras clave automáticas
  for (const rule of rules) {
    if (!rule.is_active) continue;
    const kw = (rule.keyword || '').toLowerCase().trim();
    if (!kw) continue;

    if (rule.match_type === 'exact' && msg === kw) {
      return rule.response;
    } else if (rule.match_type === 'contains' && msg.includes(kw)) {
      return rule.response;
    }
  }

  // 3. Fallback inteligente de respaldo si no hay API Key de Gemini
  if (!process.env.GEMINI_API_KEY) {
    if (msg.includes('curso') || msg.includes('udemy') || msg.includes('precio') || msg.includes('costo')) {
      return "🎓 Ofrecemos 4 cursos de especialización en Udemy:\n\n1️⃣ **OPUS 2025**: [Haz clic aquí](https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F)\n2️⃣ **OPUS + Neodata + Excel**: [Haz clic aquí](https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/)\n3️⃣ **Concursos CFE**: [Haz clic aquí](https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/)\n4️⃣ **Curso Gratis**: [Haz clic aquí](https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED)\n\nEscribe **'menu'** para volver al menú principal.";
    }
    return "👋 ¡Hola! Soy el asistente virtual de **CLIPOP**. 🏗️\n\nEscribe **'menu'** para ver nuestras opciones de Cursos y Consultorías, o escribe **'asesor'** para hablar con nuestro equipo.";
  }

  // 4. Invocar Inteligencia Artificial (Google Gemini) con System Prompt dinámico
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: history || [],
      systemInstruction: customPrompt
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (aiError) {
    console.error('[Gemini AI Bot Error]', aiError);
    return "👋 ¡Hola! Soy el asistente virtual de **CLIPOP**. ¿Te gustaría conocer nuestros cursos especializados en OPUS/Neodata o agendar una consultoría para licitaciones? Escribe **'menu'** para ver todas las opciones.";
  }
}


// 1. Webhook para recibir datos de ManyChat o Bots (WhatsApp, Facebook, Instagram)
app.post('/api/webhook/bot', async (req, res) => {
  try {
    // Datos enviados desde la integración de WhatsApp / Facebook / ManyChat:
    // { platform: 'whatsapp', phone: '+5212345678', name: 'Juan', email: 'juan@mail.com', message: 'Hola' }
    const { platform = 'whatsapp', phone, name, email, message } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (phone)' });
    }

    let lead = null;
    if (process.env.DATABASE_URL) {
      lead = await prisma.lead.upsert({
        where: { phone_or_id: phone },
        update: { 
          name: name || undefined, 
          email: email || undefined 
        },
        create: {
          platform,
          phone_or_id: phone,
          name,
          email
        }
      });

      if (message) {
        await prisma.conversation.create({
          data: {
            leadId: lead.id,
            message,
            sender: 'user'
          }
        });
      }
    } else {
      lead = inMemoryLeads.find(l => l.phone_or_id === phone);
      if (!lead) {
        lead = {
          id: inMemoryLeads.length + 101,
          name: name || `Usuario ${phone}`,
          platform,
          phone_or_id: phone,
          email: email || '',
          status: 'NUEVO',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          conversations: []
        };
        inMemoryLeads.push(lead);
      }
      if (message) {
        lead.conversations.push({
          id: lead.conversations.length + 1,
          leadId: lead.id,
          message,
          sender: 'user',
          timestamp: new Date().toISOString()
        });
      }
    }

    // Generar respuesta automática del Bot si hay mensaje
    let reply = null;
    if (message) {
      reply = await generateAiReply(message);

      if (process.env.DATABASE_URL && lead) {
        await prisma.conversation.create({
          data: {
            leadId: lead.id,
            message: reply,
            sender: 'ai'
          }
        });
      } else if (lead) {
        lead.conversations.push({
          id: lead.conversations.length + 1,
          leadId: lead.id,
          message: reply,
          sender: 'ai',
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`[Bot Webhook] Mensaje procesado para ${name || phone} (${platform})`);
    res.status(200).json({ success: true, reply, text: reply, response: reply, lead });
  } catch (error) {
    console.error('[Bot Webhook Error]', error);
    res.status(500).json({ error: 'Error interno procesando el bot' });
  }
});

// Memoria temporal para leads y conversaciones si falla o no hay base de datos conectada
let inMemoryLeads = [
  {
    id: 101,
    name: "Ing. Alejandro Ruiz",
    platform: "whatsapp",
    phone_or_id: "+52 55 1234 5678",
    email: "alejandro.ruiz@obra.mx",
    status: "EN CONTACTO",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    conversations: [
      {
        id: 1,
        leadId: 101,
        message: "Hola, estoy interesado en el curso de OPUS 2025. ¿Incluye material para licitaciones de CFE?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 2,
        leadId: 101,
        message: "¡Hola, Ing. Alejandro! Qué gusto saludarte. Sí, el curso **Análisis de Precios Unitarios 100% Práctico. OPUS 2025** incluye un módulo específico sobre estructuración de concursos técnico-económicos para la CFE, con ejemplos prácticos de Líneas de Transmisión. Te dejo el enlace del curso: https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/",
        sender: "ai",
        timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString()
      },
      {
        id: 3,
        leadId: 101,
        message: "Excelente. ¿Tienen algún código de descuento?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString()
      },
      {
        id: 4,
        leadId: 101,
        message: "¡Claro que sí! Puedes utilizar el código de referido del enlace para acceder al precio promocional de lanzamiento directamente en Udemy. ¿Te gustaría que te ayude con el proceso de inscripción?",
        sender: "ai",
        timestamp: new Date(Date.now() - 3600000 * 1.7).toISOString()
      }
    ]
  },
  {
    id: 102,
    name: "Arq. Diana Morales",
    platform: "instagram",
    phone_or_id: "@diana.morales_arq",
    email: "diana.morales@diseno.com",
    status: "NUEVO",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    conversations: [
      {
        id: 5,
        leadId: 102,
        message: "Hola, ¿el curso gratuito enseña Neodata o solo OPUS?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 6,
        leadId: 102,
        message: "¡Hola, Diana! El curso gratuito se enfoca exclusivamente en **OPUS** para análisis de costos directos, indirectos y FSR de forma introductoria. Si te interesa dominar tanto OPUS como **Neodata** y compararlos con Excel en un entorno profesional completo, te recomiendo nuestro curso completo: https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/",
        sender: "ai",
        timestamp: new Date(Date.now() - 3600000 * 4.9).toISOString()
      }
    ]
  },
  {
    id: 103,
    name: "Juan Pérez",
    platform: "messenger",
    phone_or_id: "facebook_id_892341",
    email: "juanperez@live.com.mx",
    status: "CONVERTIDO",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    conversations: [
      {
        id: 7,
        leadId: 103,
        message: "Quiero agendar una consultoría personalizada para una propuesta de obra civil",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: 8,
        leadId: 103,
        message: "¡Excelente decisión, Juan! Para consultorías personalizadas sobre licitaciones de obra civil y electromecánica, nos puedes escribir directamente por mensaje privado de Instagram a **@erick_torua** o enviarnos un correo a **contacto@gardeah.com** para coordinar los detalles. ¡Estaremos encantados de apoyarte!",
        sender: "ai",
        timestamp: new Date(Date.now() - 3600000 * 11.9).toISOString()
      }
    ]
  }
];

// 2. Ruta para que el frontend pida la lista de Leads
app.get('/api/leads', async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const leads = await prisma.lead.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
          conversations: true
        }
      });
      return res.json(leads);
    }
    throw new Error("No hay DATABASE_URL configurada");
  } catch (error) {
    // Fallback local con memoria temporal
    res.json(inMemoryLeads);
  }
});

// Ruta para añadir un mensaje manual a la conversación de un Lead (auditoría / toma manual)
app.post('/api/leads/:leadId/conversations', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { message, sender = 'human' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    if (process.env.DATABASE_URL) {
      const conversation = await prisma.conversation.create({
        data: {
          leadId: parseInt(leadId),
          message,
          sender
        }
      });
      return res.json({ success: true, conversation });
    }

    const lead = inMemoryLeads.find(l => l.id === parseInt(leadId));
    if (lead) {
      const newMsg = {
        id: lead.conversations.length + 1,
        leadId: parseInt(leadId),
        message,
        sender,
        timestamp: new Date().toISOString()
      };
      lead.conversations.push(newMsg);
      lead.updatedAt = new Date().toISOString();

      // Si el lead es de WhatsApp o Meta, enviar el mensaje saliente directamente
      if (lead.platform === 'whatsapp') {
        whatsappService.sendWhatsAppDirectMessage(lead.phone_or_id, message).catch(console.error);
      } else if (lead.platform === 'messenger' || lead.platform === 'instagram') {
        sendMetaReply({ platform: lead.platform, to: lead.phone_or_id, text: message }).catch(console.error);
      }

      return res.json({ success: true, conversation: newMsg });
    }
    res.status(404).json({ error: 'Lead no encontrado' });
  } catch (error) {
    console.error('[Add Message Error]', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// Ruta para recibir mensajes del Formulario de Contacto Web y guardarlos como Leads
app.post('/api/contact', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    if (!email || !mensaje) {
      return res.status(400).json({ error: 'Correo y mensaje son requeridos' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = (nombre || '').trim() || `Contacto Web (${cleanEmail})`;

    let lead = null;
    if (process.env.DATABASE_URL) {
      lead = await prisma.lead.upsert({
        where: { phone_or_id: cleanEmail },
        update: {
          name: cleanName,
          email: cleanEmail,
          status: 'NUEVO'
        },
        create: {
          platform: 'email',
          phone_or_id: cleanEmail,
          name: cleanName,
          email: cleanEmail,
          status: 'NUEVO'
        }
      });

      const conversation = await prisma.conversation.create({
        data: {
          leadId: lead.id,
          message: mensaje,
          sender: 'user'
        }
      });

      return res.json({ success: true, message: 'Mensaje de contacto guardado en panel con éxito', lead, conversation });
    }

    // Fallback en memoria
    lead = inMemoryLeads.find(l => l.phone_or_id === cleanEmail);
    if (!lead) {
      lead = {
        id: inMemoryLeads.length + 101,
        name: cleanName,
        platform: 'email',
        phone_or_id: cleanEmail,
        email: cleanEmail,
        status: 'NUEVO',
        bot_paused: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        conversations: []
      };
      inMemoryLeads.unshift(lead);
    }

    const newConv = {
      id: lead.conversations.length + 1,
      leadId: lead.id,
      message: mensaje,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    lead.conversations.push(newConv);
    lead.updatedAt = new Date().toISOString();

    res.json({ success: true, message: 'Mensaje de contacto guardado en panel con éxito', lead, conversation: newConv });
  } catch (error) {
    console.error('[Contact Form API Error]', error);
    res.status(500).json({ error: 'Error procesando el formulario de contacto' });
  }
});

// --- RUTAS DE WHATSAPP WEB POR CÓDIGO QR (BAILEYS) ---

// Obtener estado de la conexión de WhatsApp Web y código QR
app.get('/api/whatsapp/status', (req, res) => {
  res.json(whatsappService.getWhatsAppStatus());
});

// Iniciar sesión y generar código QR
app.post('/api/whatsapp/connect', async (req, res) => {
  try {
    await whatsappService.startWhatsAppSession();
    // Dar 1 segundo para que genere el QR
    setTimeout(() => {
      res.json(whatsappService.getWhatsAppStatus());
    }, 1200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Solicitar código de vinculación de 8 dígitos para un número de teléfono
app.post('/api/whatsapp/pairing-code', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Número de teléfono requerido' });
    }
    const result = await whatsappService.requestPairingCodeForPhone(phoneNumber);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Desconectar sesión de WhatsApp Web
app.post('/api/whatsapp/logout', async (req, res) => {
  try {
    const result = await whatsappService.logoutWhatsAppSession();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para cambiar el estado de pausa del Bot por Lead (Intervención Humana)
app.post('/api/leads/:leadId/toggle-bot', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { bot_paused } = req.body;

    if (process.env.DATABASE_URL) {
      const updatedLead = await prisma.lead.update({
        where: { id: parseInt(leadId) },
        data: { bot_paused: Boolean(bot_paused) }
      });
      return res.json({ success: true, bot_paused: updatedLead.bot_paused });
    }

    const lead = inMemoryLeads.find(l => l.id === parseInt(leadId));
    if (lead) {
      lead.bot_paused = Boolean(bot_paused);
      lead.updatedAt = new Date().toISOString();
      return res.json({ success: true, bot_paused: lead.bot_paused });
    }
    res.status(404).json({ error: 'Lead no encontrado' });
  } catch (error) {
    console.error('[Toggle Bot Error]', error);
    res.status(500).json({ error: 'Error al cambiar estado del bot' });
  }
});

// Ruta para cambiar el estado del Lead (NUEVO, EN CONTACTO, COTIZADO, CERRADO)
app.post('/api/leads/:leadId/status', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Estado requerido' });
    }

    if (process.env.DATABASE_URL) {
      const updatedLead = await prisma.lead.update({
        where: { id: parseInt(leadId) },
        data: { status }
      });
      return res.json({ success: true, lead: updatedLead });
    }

    const lead = inMemoryLeads.find(l => l.id === parseInt(leadId));
    if (lead) {
      lead.status = status;
      lead.updatedAt = new Date().toISOString();
      return res.json({ success: true, lead });
    }
    res.status(404).json({ error: 'Lead no encontrado' });
  } catch (error) {
    console.error('[Update Lead Status Error]', error);
    res.status(500).json({ error: 'Error al actualizar estado del lead' });
  }
});

// --- RUTAS PARA REGLAS DE PALABRAS CLAVE DEL BOT (KEYWORDS CRUD) ---

// Obtener todas las reglas
app.get('/api/bot/rules', async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const rules = await prisma.botRule.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.json(rules);
    }
    res.json(inMemoryBotRules);
  } catch (error) {
    res.json(inMemoryBotRules);
  }
});

// Crear o actualizar regla
app.post('/api/bot/rules', async (req, res) => {
  try {
    const { id, keyword, match_type = 'contains', response, is_active = true } = req.body;

    if (!keyword || !response) {
      return res.status(400).json({ error: 'Palabra clave y respuesta son obligatorias' });
    }

    if (process.env.DATABASE_URL) {
      let rule;
      if (id) {
        rule = await prisma.botRule.update({
          where: { id: parseInt(id) },
          data: {
            keyword: keyword.trim().toLowerCase(),
            match_type,
            response,
            is_active: Boolean(is_active)
          }
        });
      } else {
        rule = await prisma.botRule.create({
          data: {
            keyword: keyword.trim().toLowerCase(),
            match_type,
            response,
            is_active: Boolean(is_active)
          }
        });
      }
      return res.json({ success: true, rule });
    }

    // Memoria local
    if (id) {
      const idx = inMemoryBotRules.findIndex(r => r.id === parseInt(id));
      if (idx !== -1) {
        inMemoryBotRules[idx] = {
          ...inMemoryBotRules[idx],
          keyword: keyword.trim().toLowerCase(),
          match_type,
          response,
          is_active: Boolean(is_active)
        };
        return res.json({ success: true, rule: inMemoryBotRules[idx] });
      }
    }

    const newRule = {
      id: inMemoryBotRules.length + 1,
      keyword: keyword.trim().toLowerCase(),
      match_type,
      response,
      is_active: Boolean(is_active),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryBotRules.push(newRule);
    res.json({ success: true, rule: newRule });
  } catch (error) {
    console.error('[Save Bot Rule Error]', error);
    res.status(500).json({ error: 'Error guardando regla del bot' });
  }
});

// Eliminar regla
app.delete('/api/bot/rules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (process.env.DATABASE_URL) {
      await prisma.botRule.delete({
        where: { id: parseInt(id) }
      });
      return res.json({ success: true });
    }

    inMemoryBotRules = inMemoryBotRules.filter(r => r.id !== parseInt(id));
    res.json({ success: true });
  } catch (error) {
    console.error('[Delete Bot Rule Error]', error);
    res.status(500).json({ error: 'Error eliminando regla del bot' });
  }
});

// --- WEBHOOK OFICIAL DE META (WHATSAPP, INSTAGRAM, MESSENGER) ---

// Función para enviar mensajes salientes a través de la API oficial de Meta (WhatsApp / Messenger / Instagram)
async function sendMetaReply({ platform, to, text }) {
  try {
    let token = process.env.META_ACCESS_TOKEN;
    let phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    // Buscar credenciales en la base de datos si existen
    if (process.env.DATABASE_URL) {
      const settings = await prisma.setting.findMany({
        where: { key: { in: ['meta_access_token', 'whatsapp_phone_number_id'] } }
      });
      settings.forEach(s => {
        if (s.key === 'meta_access_token' && s.value.trim()) token = s.value.trim();
        if (s.key === 'whatsapp_phone_number_id' && s.value.trim()) phoneId = s.value.trim();
      });
    }

    if (!token) {
      console.log('[Meta Outbound] Token de Meta no configurado aún en Settings o .env');
      return { success: false, reason: 'Token no configurado' };
    }

    if (platform === 'whatsapp') {
      if (!phoneId) {
        console.log('[Meta Outbound WhatsApp] Falta WHATSAPP_PHONE_NUMBER_ID');
        return { success: false, reason: 'Phone ID no configurado' };
      }

      // Limpiar formato de teléfono
      const cleanPhone = String(to).replace(/[^0-9]/g, '');

      const response = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: 'text',
          text: { body: text }
        })
      });

      const data = await response.json();
      console.log('[Meta WhatsApp API Response]', data);
      return { success: response.ok, data };
    } else {
      // Instagram Direct o Facebook Messenger
      const response = await fetch(`https://graph.facebook.com/v18.0/me/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: { id: to },
          message: { text }
        })
      });

      const data = await response.json();
      console.log('[Meta Messenger/IG API Response]', data);
      return { success: response.ok, data };
    }
  } catch (error) {
    console.error('[Meta Outbound Error]', error.message);
    return { success: false, error: error.message };
  }
}

// Endpoint para probar el envío de un mensaje real a WhatsApp desde el panel de control
app.post('/api/meta/test-message', async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Número de teléfono requerido' });
    }

    const testText = message || '¡Hola! Este es un mensaje de prueba enviado directamente desde el nuevo Panel de Control de CLIPOP.';
    const result = await sendMetaReply({ platform: 'whatsapp', to: phone, text: testText });

    if (result.success) {
      return res.json({ success: true, message: 'Mensaje enviado a WhatsApp con éxito', data: result.data });
    } else {
      return res.status(400).json({ success: false, error: result.reason || result.error || 'Error al enviar a Meta' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verificación de Webhook para Meta for Developers (soporta /api/webhooks/meta y /api/meta/webhook)
const handleMetaWebhookVerification = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = process.env.META_VERIFY_TOKEN || 'clipop_bot_verify_token_2026';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[Meta Webhook] Verificado con éxito por Meta');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

app.get('/api/webhooks/meta', handleMetaWebhookVerification);
app.get('/api/meta/webhook', handleMetaWebhookVerification);

// Receptor de mensajes de Meta (WhatsApp Cloud API / Instagram / Messenger)
const handleMetaWebhookIncoming = async (req, res) => {
  try {
    const body = req.body;
    console.log('[Meta Webhook Event Received]', JSON.stringify(body));

    if (body.object === 'whatsapp_business_account' || body.object === 'page' || body.object === 'instagram') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0]?.value;
      const messaging = entry?.messaging?.[0];

      let phoneOrId = null;
      let senderName = null;
      let messageText = null;
      let platform = body.object === 'whatsapp_business_account' ? 'whatsapp' : (body.object === 'instagram' ? 'instagram' : 'messenger');

      // WhatsApp Cloud API Payload
      if (changes && changes.messages && changes.messages[0]) {
        const msg = changes.messages[0];
        phoneOrId = msg.from;
        senderName = changes.contacts?.[0]?.profile?.name || `WhatsApp ${phoneOrId}`;
        if (msg.type === 'text') {
          messageText = msg.text?.body;
        }
      } 
      // Instagram / Messenger Payload
      else if (messaging && messaging.message) {
        phoneOrId = messaging.sender?.id;
        senderName = `Usuario ${platform === 'instagram' ? 'Instagram' : 'Facebook'}`;
        messageText = messaging.message.text;
      }

      if (phoneOrId && messageText) {
        let lead = null;
        if (process.env.DATABASE_URL) {
          lead = await prisma.lead.upsert({
            where: { phone_or_id: phoneOrId },
            update: { name: senderName || undefined },
            create: {
              platform,
              phone_or_id: phoneOrId,
              name: senderName
            }
          });

          await prisma.conversation.create({
            data: {
              leadId: lead.id,
              message: messageText,
              sender: 'user'
            }
          });
        } else {
          // Fallback en memoria para desarrollo local
          lead = inMemoryLeads.find(l => l.phone_or_id === phoneOrId);
          if (!lead) {
            lead = {
              id: inMemoryLeads.length + 101,
              name: senderName,
              platform,
              phone_or_id: phoneOrId,
              email: '',
              status: 'NUEVO',
              bot_paused: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              conversations: []
            };
            inMemoryLeads.unshift(lead);
          }
          lead.conversations.push({
            id: lead.conversations.length + 1,
            leadId: lead.id,
            message: messageText,
            sender: 'user',
            timestamp: new Date().toISOString()
          });
          lead.updatedAt = new Date().toISOString();
        }

        // Si el bot NO está pausado para este lead, generar respuesta automática
        const isPaused = lead ? lead.bot_paused : false;
        if (!isPaused) {
          const reply = await generateAiReply(messageText);

          if (process.env.DATABASE_URL && lead) {
            await prisma.conversation.create({
              data: {
                leadId: lead.id,
                message: reply,
                sender: 'ai'
              }
            });
          } else if (lead && lead.conversations) {
            lead.conversations.push({
              id: lead.conversations.length + 1,
              leadId: lead.id,
              message: reply,
              sender: 'ai',
              timestamp: new Date().toISOString()
            });
          }

          // Enviar la respuesta directamente a WhatsApp, Messenger o Instagram a través de Meta API
          await sendMetaReply({ platform, to: phoneOrId, text: reply });
        }
      }

      return res.status(200).send('EVENT_RECEIVED');
    }

    res.sendStatus(404);
  } catch (error) {
    console.error('[Meta Webhook Error]', error);
    res.status(500).send('ERROR');
  }
};

app.post('/api/webhooks/meta', handleMetaWebhookIncoming);
app.post('/api/meta/webhook', handleMetaWebhookIncoming);


// 3. Ruta para el Chatbot de la Landing Page
app.post('/api/chat', async (req, res) => {
  try {
    const { history, message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }
    const reply = await generateAiReply(message, history);
    res.json({ reply });
  } catch (error) {
    console.error('[Chatbot Error]', error);
    res.status(500).json({ error: 'Error procesando el mensaje del chat.' });
  }
});

// --- RUTAS PARA PRODUCTOS / CURSOS Y CATÁLOGO ---

let inMemoryProducts = [
  {
    id: '483B20BB76F1F136B88D',
    name: 'Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel',
    titulo: 'Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel',
    status: 'ACTIVO',
    is_active: true,
    category: 'CURSO',
    type: 'DIGITAL',
    author: 'FRANCISCO RAMÓN GARDEA HERNÁNDEZ',
    created: '18/6/2026',
    url: 'https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/',
    enlace: 'https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/',
    description: 'Curso completo enfocado en estructurar presupuestos y análisis de precios unitarios (APU) desde cero, dominando OPUS (versiones 22 y 24), Neodata y Excel.',
    descripcion: 'Curso completo enfocado en estructurar presupuestos y análisis de precios unitarios (APU) desde cero, dominando OPUS (versiones 22 y 24), Neodata y Excel.',
    imagen: '/concurso_subestacion.png',
    rating: '4.4',
    valoraciones: '226',
    estudiantes: '1,244',
    badge: 'Más Vendido',
    badgeColor: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
    price: 0
  },
  {
    id: 'CE4F47D87E543CA1CB75',
    name: 'Cómo Presentar Concursos para CFE desde cero con OPUS 2020',
    titulo: 'Cómo Presentar Concursos para CFE desde cero con OPUS 2020',
    status: 'ACTIVO',
    is_active: true,
    category: 'CURSO',
    type: 'DIGITAL',
    author: 'FRANCISCO RAMÓN GARDEA HERNÁNDEZ',
    created: '18/6/2026',
    url: 'https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/',
    enlace: 'https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/',
    description: 'Guía práctica y metodológica para armar y presentar propuestas de licitaciones técnico-económicas para la Comisión Federal de Electricidad (CFE) en México usando OPUS 2020.',
    descripcion: 'Guía práctica y metodológica para armar y presentar propuestas de licitaciones técnico-económicas para la Comisión Federal de Electricidad (CFE) en México usando OPUS 2020.',
    imagen: '/concurso_lineas.png',
    rating: '4.9',
    valoraciones: '24',
    estudiantes: '77',
    badge: 'Mejor Valorado',
    badgeColor: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
    price: 0
  },
  {
    id: '37ABE3618B5C83C37D65',
    name: 'OPUS 2020 - Análisis de Precios Unitarios',
    titulo: 'OPUS 2020 - Análisis de Precios Unitarios',
    status: 'ACTIVO',
    is_active: true,
    category: 'CURSO',
    type: 'DIGITAL',
    author: 'FRANCISCO RAMÓN GARDEA HERNÁNDEZ',
    created: '18/6/2026',
    url: 'https://www.udemy.com/course/opus-2020-analisis-de-precios-unitarios/',
    enlace: 'https://www.udemy.com/course/opus-2020-analisis-de-precios-unitarios/',
    description: 'Curso de especialización dedicado al dominio del análisis de costos directos, indirectos, cálculo de factor de salario integrado (FSR) y presupuestación en la versión 2020 de OPUS.',
    descripcion: 'Curso de especialización dedicado al dominio del análisis de costos directos, indirectos, cálculo de factor de salario integrado (FSR) y presupuestación en la versión 2020 de OPUS.',
    imagen: '/concurso_redes.png',
    rating: '4.6',
    valoraciones: '62',
    estudiantes: '754',
    badge: 'Acceso Gratuito',
    badgeColor: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]',
    price: 0
  },
  {
    id: '91F84A20B71E492C1012',
    name: 'Análisis de Precios Unitarios 100% Práctico. OPUS 2025',
    titulo: 'Análisis de Precios Unitarios 100% Práctico. OPUS 2025',
    status: 'ACTIVO',
    is_active: true,
    category: 'CURSO',
    type: 'DIGITAL',
    author: 'FRANCISCO RAMÓN GARDEA HERNÁNDEZ',
    created: '20/6/2026',
    url: 'https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F',
    enlace: 'https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F',
    description: 'Curso del Ing. Francisco Gardea enfocado en el manejo de OPUS 2025, estructuración de concursos de CFE, elaboración de precios unitarios conforme a especificaciones vigentes y desarrollo de entregables.',
    descripcion: 'Curso del Ing. Francisco Gardea enfocado en el manejo de OPUS 2025, estructuración de concursos de CFE, elaboración de precios unitarios conforme a especificaciones vigentes y desarrollo de entregables.',
    imagen: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    rating: '5.0',
    valoraciones: '2',
    estudiantes: '3',
    badge: 'Nuevo Curso',
    badgeColor: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
    price: 0
  }
];

// GET /api/products
app.get('/api/products', async (req, res) => {
  const { activeOnly } = req.query;
  try {
    if (process.env.DATABASE_URL) {
      const where = activeOnly === 'true' ? { is_active: true } : {};
      const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
      if (products.length > 0) return res.json(products);
    }
  } catch (err) {
    console.error('[API Products GET Error]', err);
  }
  let result = inMemoryProducts;
  if (activeOnly === 'true') {
    result = result.filter(p => p.status === 'ACTIVO' || p.is_active === true);
  }
  res.json(result);
});

// POST /api/products
app.post('/api/products', async (req, res) => {
  const newProd = {
    id: req.body.id || Math.random().toString(36).substring(2, 12).toUpperCase(),
    name: req.body.name || req.body.titulo || 'Nuevo Curso',
    titulo: req.body.name || req.body.titulo || 'Nuevo Curso',
    status: req.body.status || 'ACTIVO',
    is_active: req.body.status === 'ACTIVO' || req.body.is_active !== false,
    category: req.body.category || 'CURSO',
    type: req.body.type || 'DIGITAL',
    author: req.body.author || 'FRANCISCO RAMÓN GARDEA HERNÁNDEZ',
    created: new Date().toLocaleDateString('es-MX'),
    url: req.body.url || req.body.enlace || '#',
    enlace: req.body.url || req.body.enlace || '#',
    description: req.body.description || req.body.descripcion || '',
    descripcion: req.body.description || req.body.descripcion || '',
    imagen: req.body.imagen || req.body.image_url || '/concurso_subestacion.png',
    rating: req.body.rating || '5.0',
    valoraciones: '1',
    estudiantes: '1',
    badge: req.body.badge || 'Nuevo Curso',
    badgeColor: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
    price: parseFloat(req.body.price) || 0
  };

  try {
    if (process.env.DATABASE_URL) {
      await prisma.product.create({
        data: {
          name: newProd.name,
          description: newProd.description,
          price: newProd.price,
          image_url: newProd.imagen,
          link: newProd.url,
          is_active: newProd.is_active
        }
      });
    }
  } catch (err) {
    console.error('[API Products POST Error]', err);
  }

  inMemoryProducts.unshift(newProd);
  res.status(201).json({ success: true, product: newProd });
});

// PUT /api/products/:id
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const index = inMemoryProducts.findIndex(p => String(p.id) === String(id));
  
  if (index !== -1) {
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...req.body };
    if (req.body.status) {
      inMemoryProducts[index].is_active = req.body.status === 'ACTIVO';
    }
    if (req.body.name) {
      inMemoryProducts[index].titulo = req.body.name;
    }
    if (req.body.description) {
      inMemoryProducts[index].descripcion = req.body.description;
    }
  }

  res.json({ success: true, product: inMemoryProducts[index] || req.body });
});

// DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  inMemoryProducts = inMemoryProducts.filter(p => String(p.id) !== String(id));
  res.json({ success: true });
});

// --- RUTAS PARA CONFIGURACIÓN (SETTINGS) ---

// Memoria temporal por si no hay base de datos conectada aún
let inMemorySettings = {
  podcast_is_live: 'false',
  podcast_live_url: '',
  login_bg_color: '#6b2143'
};

// 4. Obtener configuraciones (Podcast, etc.)
app.get('/api/settings', async (req, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const settings = await prisma.setting.findMany();
      const settingsMap = {};
      settings.forEach(s => {
        settingsMap[s.key] = s.value;
      });
      return res.json(settingsMap);
    }
    throw new Error("No hay DATABASE_URL configurada");
  } catch (error) {
    // Fallback local
    res.json(inMemorySettings);
  }
});

// 5. Guardar configuraciones
app.post('/api/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (process.env.DATABASE_URL) {
      // Iteramos y guardamos o actualizamos cada llave en la BD
      for (const [key, value] of Object.entries(settings)) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) }
        });
      }
      return res.json({ success: true });
    }
    throw new Error("No hay DATABASE_URL configurada");
  } catch (error) {
    // Fallback local
    const { settings } = req.body;
    for (const [key, value] of Object.entries(settings)) {
      inMemorySettings[key] = String(value);
    }
    res.json({ success: true, warning: 'Usando memoria temporal por falta de base de datos' });
  }
});

// --- SERVIR EL FRONTEND (PÁGINA WEB) ---
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[Servidor] Escuchando en el puerto ${PORT}`);
  console.log(`[Servidor] A la espera de la conexión a la Base de Datos...`);

  // Auto-iniciar sesión de WhatsApp para responder de inmediato
  whatsappService.startWhatsAppSession().catch(err => {
    console.error('[WhatsApp AutoStart Error]', err.message);
  });
});
