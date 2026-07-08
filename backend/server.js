const express = require('express');
const cors = require('cors');
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

// 2. Ruta para que el frontend pida la lista de Leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        conversations: true
      }
    });
    res.json(leads);
  } catch (error) {
    console.error('[API Leads Error]', error);
    res.status(500).json({ error: 'Error obteniendo leads' });
  }
});

// 3. Ruta para el Chatbot de la Landing Page
app.post('/api/chat', async (req, res) => {
  try {
    const { history, message } = req.body;
    
    // Si no hay API KEY, utilizar un chatbot local interactivo basado en reglas de palabras clave (Fallback local)
    if (!process.env.GEMINI_API_KEY) {
      const msg = message.toLowerCase();
      let reply = "¡Hola! Soy el asistente virtual de GardeaH. 👋 Actualmente estoy en modo de prueba local. Escribe 'cursos' para ver la lista de capacitaciones, o pregunta por temas específicos como 'OPUS', 'CFE', 'Neodata' o 'contacto'.";
      
      if (msg.includes('curso') || msg.includes('ver') || msg.includes('lista') || msg.includes('aprender') || msg.includes('capacitacion')) {
        reply = "Ofrecemos 3 cursos especializados en ingeniería de costos:\n\n1️⃣ **Precios Unitarios OPUS 22/24, Neodata y Excel**\n2️⃣ **Cómo Presentar Concursos para CFE con OPUS 2020**\n3️⃣ **OPUS 2020 - Análisis de Precios Unitarios**\n\n¿De cuál te gustaría recibir más detalles?";
      } else if (msg.includes('opus 22') || msg.includes('opus 24') || msg.includes('neodata') || msg.includes('excel') || msg.includes('1')) {
        reply = "¡Excelente! El curso **Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel** te enseña desde cero a estructurar presupuestos y APUs.\n👉 Detalles e Inscripción: https://www.udemy.com/course/precios-unitarios-opus-22-opus-24-neodata-y-excel/";
      } else if (msg.includes('cfe') || msg.includes('concurso') || msg.includes('licitacion') || msg.includes('2')) {
        reply = "El curso **Cómo Presentar Concursos para CFE desde cero con OPUS 2020** es una guía metodológica completa para armar propuestas técnico-económicas de licitación.\n👉 Detalles e Inscripción: https://www.udemy.com/course/como-presentar-concursos-para-cfe-desde-cero-con-opus-2020/";
      } else if (msg.includes('analisis') || msg.includes('precios') || msg.includes('unitarios') || msg.includes('3') || msg.includes('fsr')) {
        reply = "La especialización **OPUS 2020 - Análisis de Precios Unitarios** se enfoca en el cálculo de FSR, costos directos, indirectos y presupuestación bajo normativa.\n👉 Detalles e Inscripción: https://www.udemy.com/course/opus-2020-analisis-de-precios-unitarios/";
      } else if (msg.includes('contacto') || msg.includes('hablar') || msg.includes('erick') || msg.includes('soporte') || msg.includes('consultoria') || msg.includes('precio') || msg.includes('correo')) {
        reply = "Para consultorías personalizadas o hablar directamente con Erick Torua, por favor escríbenos a contacto@gardeah.com o utiliza los enlaces de redes sociales.";
      }
      
      return res.json({ reply });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Instrucciones base para vender
    const systemPrompt = `Eres un asistente de ventas de una empresa especializada en la industria de la construcción. Tu objetivo principal es ayudar a los visitantes y ofrecer los 3 cursos disponibles:
1. Precios Unitarios OPUS 22, OPUS 24, Neodata y Excel
2. Cómo Presentar Concursos para CFE desde cero con OPUS 2020
3. OPUS 2020 - Análisis de Precios Unitarios
Si preguntan por servicios o consultorías, invítalos a contactarte por Instagram usando los botones de la página. Sé amable y directo.`;

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[Servidor] Escuchando en el puerto ${PORT}`);
  console.log(`[Servidor] A la espera de la conexión a la Base de Datos...`);
});
