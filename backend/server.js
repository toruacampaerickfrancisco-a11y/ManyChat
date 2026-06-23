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
    
    // Si no hay API KEY, devolver un mensaje mock
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ 
        reply: "Hola! Soy el asistente virtual (Modo de Prueba). Por el momento, el administrador de la página no ha configurado la API Key de inteligencia artificial. Si buscas cursos, puedes explorar los enlaces más abajo." 
      });
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[Servidor] Escuchando en el puerto ${PORT}`);
  console.log(`[Servidor] A la espera de la conexión a la Base de Datos...`);
});
