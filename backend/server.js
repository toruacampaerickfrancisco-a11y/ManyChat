const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

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

// --- RUTAS PARA BOT Y LEADS ---

// 1. Webhook para recibir datos de ManyChat o Bots
app.post('/api/webhook/bot', async (req, res) => {
  try {
    // Ejemplo de datos que enviaría ManyChat:
    // { platform: 'whatsapp', phone: '+5212345678', name: 'Juan', email: 'juan@mail.com', message: 'Hola' }
    const { platform, phone, name, email, message } = req.body;

    if (!platform || !phone) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (platform, phone)' });
    }

    // Guardar o actualizar el lead
    const lead = await prisma.lead.upsert({
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

    // Opcional: Guardar el mensaje en la tabla de Conversaciones
    if (message) {
      await prisma.conversation.create({
        data: {
          leadId: lead.id,
          message,
          sender: 'user'
        }
      });
    }

    console.log(`[Bot] Nuevo Lead procesado: ${name || phone}`);
    res.status(200).json({ success: true, lead });
  } catch (error) {
    console.error('[Bot Webhook Error]', error);
    res.status(500).json({ error: 'Error interno guardando el lead' });
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
    const { message, sender } = req.body;

    if (!message || !sender) {
      return res.status(400).json({ error: 'Faltan datos obligatorios (message, sender)' });
    }

    if (process.env.DATABASE_URL) {
      const conversation = await prisma.conversation.create({
        data: {
          leadId: parseInt(leadId),
          message,
          sender // "user" o "ai"
        }
      });
      return res.json({ success: true, conversation });
    }

    // Fallback local en memoria
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
      return res.json({ success: true, conversation: newMsg });
    }

    res.status(404).json({ error: 'Lead no encontrado' });
  } catch (error) {
    console.error('[API Send Message Error]', error);
    res.status(500).json({ error: 'Error interno al enviar mensaje' });
  }
});

// 3. Ruta para el Chatbot de la Landing Page
app.post('/api/chat', async (req, res) => {
  try {
    const { history, message } = req.body;
    const msg = message.toLowerCase().trim();

    // Interceptar de forma estricta las opciones del menú guiado para responder al instante
    if (msg === '1' || msg === 'cursos' || msg === 'catálogo') {
      const reply = "Aquí tienes nuestro catálogo de cursos especializados en Udemy para que formules presupuestos ganadores de obra:\n\n" +
              "1️⃣ **Análisis de Precios Unitarios 100% Práctico (OPUS 2025)**\n" +
              "👉 Nuevo lanzamiento: [OPUS 2025: Haz clic aquí](https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F)\n\n" +
              "2️⃣ **Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel**\n" +
              "👉 Más Vendido: [Curso OPUS/Neodata/Excel: Haz clic aquí](https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/)\n\n" +
              "3️⃣ **Cómo Presentar Concursos para CFE desde cero con OPUS 2020**\n" +
              "👉 Mejor Valorado: [Curso Concursos CFE: Haz clic aquí](https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/)\n\n" +
              "4️⃣ **OPUS. ANÁLISIS DE PRECIOS UNITARIOS. ¡GRATIS!**\n" +
              "👉 Acceso Gratuito: [Curso Gratis OPUS: Haz clic aquí](https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED)\n\n" +
              "Escribe la palabra clave del curso para darte detalles:\n" +
              "- Escribe **'2025'** para ver detalles de OPUS 2025\n" +
              "- Escribe **'completo'** para ver detalles de OPUS, Neodata y Excel\n" +
              "- Escribe **'cfe'** para ver detalles de Concursos CFE\n" +
              "- Escribe **'gratis'** para ver el curso introductorio gratuito\n\n" +
              "O escribe **'menu'** para volver al inicio.";
      return res.json({ reply });
    }

    if (msg === '2025' || msg.includes('2025')) {
      const reply = "🏗️ **Análisis de Precios Unitarios 100% Práctico (OPUS 2025)**:\n\n" +
                    "Aprende paso a paso con la versión más reciente del mercado. Este curso te guiará en el análisis de costos directos, indirectos, cálculo del Factor de Salario Real (FSR) y la estructuración de presupuestos técnico-económicos listos para concursos.\n\n" +
                    "👉 [OPUS 2025: Haz clic aquí](https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F)\n\n" +
                    "Escribe **'cursos'** para ver otros temas o **'menu'** para volver.";
      return res.json({ reply });
    }

    if (msg === 'completo' || msg.includes('estrella') || msg.includes('neodata') || msg.includes('excel')) {
      const reply = "⭐ **Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel**:\n\n" +
                    "Es nuestro curso estrella y el más vendido. En él aprenderás y compararás de forma práctica el flujo de trabajo en las tres herramientas líderes de la industria de la construcción para presupuestar obras públicas y privadas.\n\n" +
                    "👉 [Curso OPUS/Neodata/Excel: Haz clic aquí](https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/)\n\n" +
                    "Escribe **'cursos'** para ver otros temas o **'menu'** para volver.";
      return res.json({ reply });
    }

    if (msg === 'cfe' || msg.includes('concursos cfe') || msg.includes('concurso cfe')) {
      const reply = "⚡ **Cómo Presentar Concursos para CFE desde cero con OPUS 2020**:\n\n" +
                    "Es nuestro curso mejor valorado por los estudiantes. Aprenderás a integrar propuestas técnico-económicas completas bajo la normativa vigente de la Comisión Federal de Electricidad (CFE) utilizando herramientas del software OPUS.\n\n" +
                    "👉 [Curso Concursos CFE: Haz clic aquí](https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/)\n\n" +
                    "Escribe **'cursos'** para ver otros temas o **'menu'** para volver.";
      return res.json({ reply });
    }

    if (msg === 'gratis' || msg === 'gratuito') {
      const reply = "🎁 **OPUS. ANÁLISIS DE PRECIOS UNITARIOS. ¡GRATIS!**:\n\n" +
                    "Ideal si vas empezando en la ingeniería de costos. Te familiarizarás con la interfaz de usuario de OPUS, la creación de insumos, costos directos y conceptos esenciales para la presupuestación.\n\n" +
                    "👉 [Curso Gratis OPUS: Haz clic aquí](https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED)\n\n" +
                    "Escribe **'cursos'** para ver otros temas o **'menu'** para volver.";
      return res.json({ reply });
    }

    if (msg === '2' || msg === 'contacto' || msg === 'redes') {
      const reply = "¡Excelente! Elige el medio de contacto que prefieras para comunicarte con nosotros:\n\n" +
              "🟢 **WhatsApp Directo**: [WhatsApp: Haz clic aquí](https://wa.me/521234567890)\n" +
              "📸 **Instagram Direct**: [Instagram Direct: Haz clic aquí](https://ig.me/m/erick_torua) (o síguenos en [@erick_torua](https://www.instagram.com/erick_torua/))\n" +
              "🔵 **Facebook**: [Facebook: Haz clic aquí](https://www.facebook.com/profile.php?id=61591764152849)\n" +
              "✉️ **Formulario de Correo en la Web**: [Formulario de Contacto: Haz clic aquí](/contacto) (Te redireccionará para que nos envíes un mail directo)\n\n" +
              "Escribe **'menu'** si quieres regresar al inicio.";
      return res.json({ reply });
    }

    if (msg === 'menu' || msg === 'inicio' || msg === 'volver') {
      const reply = "Elige una opción escribiendo el número correspondiente:\n\n" +
                    "1️⃣ **Cursos** (Ver nuestras especializaciones en OPUS, Neodata y CFE con descuento)\n" +
                    "2️⃣ **Contacto y Consultorías** (Hablar con nosotros o agendar servicios)";
      return res.json({ reply });
    }
    
    // Si no hay API KEY, utilizar un chatbot local interactivo basado en reglas de palabras clave (Fallback local)
    if (!process.env.GEMINI_API_KEY) {
      const msg = message.toLowerCase();
      let reply = "¡Hola! Soy el asistente virtual de **Clipop**. 🏗️ Estoy aquí para ayudarte a dominar la ingeniería de costos. Escribe **'cursos'** para ver nuestro catálogo con descuento, **'redes'** para seguirnos en Instagram y Facebook, o pregunta directamente sobre **'OPUS'**, **'CFE'**, **'Neodata'** o **'consultoría'**.";
      
      if (msg.includes('curso') || msg.includes('ver') || msg.includes('lista') || msg.includes('aprender') || msg.includes('capacitacion') || msg.includes('udemy')) {
        reply = "Actualmente ofrecemos 4 cursos de especialización en Udemy para que formules presupuestos ganadores:\n\n" +
                "1️⃣ **Análisis de Precios Unitarios 100% Práctico (OPUS 2025)**\n" +
                "👉 Nuevo lanzamiento: https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F\n\n" +
                "2️⃣ **Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel**\n" +
                "👉 Más Vendido: https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/\n\n" +
                "3️⃣ **Cómo Presentar Concursos para CFE desde cero con OPUS 2020**\n" +
                "👉 Mejor Valorado: https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/\n\n" +
                "4️⃣ **OPUS. ANÁLISIS DE PRECIOS UNITARIOS. ¡GRATIS!**\n" +
                "👉 Acceso Gratuito: https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED\n\n" +
                "¿Cuál de estos te interesa más para empezar a triunfar hoy?";
      } else if (msg.includes('redes') || msg.includes('social') || msg.includes('instagram') || msg.includes('facebook') || msg.includes('ig') || msg.includes('fb') || msg.includes('contacto')) {
        reply = "¡Mantente conectado con **Clipop**! Aquí tienes los accesos directos a nuestras redes:\n\n" +
                "📸 **Instagram**: [Instagram: Haz clic aquí](https://ig.me/m/erick_torua)\n" +
                "🔵 **Facebook**: [Facebook: Haz clic aquí](https://www.facebook.com/profile.php?id=61591764152849)\n" +
                "🟢 **WhatsApp**: [WhatsApp: Haz clic aquí](https://wa.me/521234567890)\n" +
                "✉️ **Correo**: clipopoficial@gmail.com\n\n" +
                "¿Te gustaría agendar una consultoría personalizada para tu empresa?";
      } else if (msg.includes('opus') || msg.includes('2025') || msg.includes('22') || msg.includes('24') || msg.includes('software')) {
        reply = "OPUS es la herramienta líder para presupuestar obras. Con nuestro nuevo curso **OPUS 2025** aprenderás la metodología de análisis de precios unitarios y cálculo del FSR. ¡Es ideal para asegurar contratos! Inscríbete aquí:\n[OPUS 2025: Haz clic aquí](https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F)";
      } else if (msg.includes('cfe') || msg.includes('concurso') || msg.includes('licitacion')) {
        reply = "Para ganar concursos de CFE, necesitas dominar la estructuración de la propuesta técnico-económica y el cálculo del Factor de Salario Integrado (FSR). Te enseñamos todo esto paso a paso en nuestro curso mejor valorado:\n[Curso Concursos CFE: Haz clic aquí](https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/)";
      } else if (msg.includes('neodata') || msg.includes('excel')) {
        reply = "Neodata es otra de las herramientas preferidas por las constructoras. En nuestro curso estrella comparamos el flujo de trabajo en OPUS, Neodata y Excel para que elijas la mejor opción:\n[Curso OPUS/Neodata/Excel: Haz clic aquí](https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/)";
      } else if (msg.includes('consult') || msg.includes('asesor') || msg.includes('empresa') || msg.includes('servicio') || msg.includes('obra')) {
        reply = "Ofrecemos servicios de consultoría especializada en licitaciones de obra civil y electromecánica. Puedes enviarle un mensaje directo a Erick Torua en Instagram:\n[Instagram Direct: Haz clic aquí](https://ig.me/m/erick_torua) para cotizar tu propuesta técnico-económica de inmediato.";
      }
      
      return res.json({ reply });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Instrucciones base para vender
    const systemPrompt = `Eres un asesor de ventas altamente persuasivo y experto en ingeniería de costos y licitaciones para CLIPOP (la consultora de Erick Torua).
Tus objetivos principales son:
1. Resolver dudas técnicas sobre OPUS, Neodata, presupuestos, cálculo de FSR (Factor de Salario Integrado), costos directos/indirectos y licitaciones para la Comisión Federal de Electricidad (CFE) en México. Simula que haces investigación web en tiempo real para dar respuestas ultra-precisas, actualizadas y profesionales que demuestren máxima autoridad técnica.
2. Promocionar e incentivar la compra de los 4 cursos disponibles en Udemy (siempre proporciona los enlaces exactos usando obligatoriamente este formato markdown de texto 'Haz clic aquí'):
   - "Análisis de Precios Unitarios 100% Práctico. OPUS 2025" (Curso de Lanzamiento Nuevo): [OPUS 2025: Haz clic aquí](https://www.udemy.com/course/analisis-de-precios-unitarios-100-practico-opus-2025/?referralCode=7AB469DC79C4A895813F)
   - "Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel" (Más Vendido): [Curso OPUS/Neodata/Excel: Haz clic aquí](https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/)
   - "Cómo Presentar Concursos para CFE desde cero con OPUS 2020" (Mejor Valorado): [Curso Concursos CFE: Haz clic aquí](https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/)
   - "OPUS. ANALISIS DE PRECIOS UNITARIOS. GRATIS!!" (Acceso Gratuito): [Curso Gratis OPUS: Haz clic aquí](https://www.udemy.com/course/analisis-de-precios-unitarios-gratis/?referralCode=F897FBB286B09C70CCED)
3. Fomentar la contratación de servicios de consultoría especializada para armar licitaciones. Dirige al usuario a hablar con Erick Torua en Instagram Direct usando estrictamente este enlace: [Instagram Direct: Haz clic aquí](https://ig.me/m/erick_torua) o a seguir la página de Facebook de CLIPOP usando este enlace: [Facebook: Haz clic aquí](https://www.facebook.com/profile.php?id=61591764152849) o escribir a WhatsApp usando este enlace: [WhatsApp: Haz clic aquí](https://wa.me/521234567890).
4. Utilizar técnicas de venta persuasiva, sé entusiasta, profesional, demuestra maestría técnica en OPUS y cierra la respuesta con un llamado a la acción enfocado a la venta o al contacto directo.`;

    const chat = model.startChat({
      history: history || [],
      systemInstruction: systemPrompt
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
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
});
