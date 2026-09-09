const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const { prisma } = require('../config/database');
const { SYSTEM_PROMPT, ORIGINAL_BOT_RULES } = require('../config/constants');

let genAI = null;
if (config.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
}

class AgentOrchestrator {
  constructor() {
    this.modelName = 'gemini-1.5-flash';
  }

  async processMessage({ leadId, platform, phoneOrId, senderName, userMessage }) {
    const rawMsg = (userMessage || '').trim();
    const msg = rawMsg.toLowerCase();
    if (!msg) {
      return {
        text: "¡Hola! 👋 Muchas gracias por contactarnos, será un placer atenderte. Escribe *0* o *'menu'* para ver nuestras opciones.",
        source: 'fallback'
      };
    }

    // 1. EVALUACIÓN PRIORITARIA DE REGLAS EXACTAS ORIGINALES DE CLIPOP
    // A. Menú Principal (0, hola, menu, inicio, buenas)
    if (/^(0|0️⃣|menu|menú|inicio|volver|hola|empezar|welcome_message|get started|buenas|buenos dias|buenas tardes)$/i.test(msg)) {
      const menuRule = ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu');
      return { text: menuRule.response, source: 'rule' };
    }

    // B. Opción 1: Cursos pregrabados (Udemy)
    if (/^(1|1️⃣|1\.|1\s|opci[oó]n 1|cursos? pregrabados?|udemy|pregrabados)$/i.test(msg)) {
      const r1 = ORIGINAL_BOT_RULES.find(r => r.id === 6);
      return { text: r1.response, source: 'rule' };
    }

    // C. Opción 2: Cursos en tiempo real (Teams)
    if (/^(2|2️⃣|2\.|2\s|opci[oó]n 2|cursos? en tiempo real|teams|virtual|virtuales)$/i.test(msg)) {
      const r2 = ORIGINAL_BOT_RULES.find(r => r.id === 9);
      return { text: r2.response, source: 'rule' };
    }

    // D. Opción 3: Cursos presenciales (Hermosillo)
    if (/^(3|3️⃣|3\.|3\s|opci[oó]n 3|cursos? presenciales?|presencial|hermosillo)$/i.test(msg)) {
      const r3 = ORIGINAL_BOT_RULES.find(r => r.id === 12);
      return { text: r3.response, source: 'rule' };
    }

    // E. Opción 4: Cotización de proyectos
    if (/^(4|4️⃣|4\.|4\s|opci[oó]n 4|cotizaci[oó]n|cotizar|proyectos?|media tensi[oó]n|alta tensi[oó]n)$/i.test(msg)) {
      const r4 = ORIGINAL_BOT_RULES.find(r => r.id === 15);
      return { text: r4.response, source: 'rule' };
    }

    // F. Flujo "¿Tienes alguna otra duda?": 'Sí'
    if (/^(s[ií]|s[ií] tengo dudas?|tengo una duda|otra duda)$/i.test(msg)) {
      const rSi = ORIGINAL_BOT_RULES.find(r => r.keyword === 'si');
      return { text: rSi.response, source: 'rule' };
    }

    // G. Flujo "¿Tienes alguna otra duda?": 'No'
    if (/^(no|no gracias|ninguna|todo bien|todo claro|adi[oó]s|bye)$/i.test(msg)) {
      const rNo = ORIGINAL_BOT_RULES.find(r => r.keyword === 'no');
      return { text: rNo.response, source: 'rule' };
    }

    // H. Contacto con Asesor Humano
    if (/(asesor|humano|persona|operador|francisco)/i.test(msg)) {
      if (prisma && leadId) {
        try {
          await prisma.lead.update({ where: { id: leadId }, data: { bot_paused: true } });
        } catch (e) {}
      }
      const rAsesor = ORIGINAL_BOT_RULES.find(r => r.id === 21);
      return { text: rAsesor.response, source: 'rule' };
    }

    // 2. Verificar reglas adicionales configuradas en la base de datos
    try {
      if (prisma) {
        const dbRules = await prisma.botRule.findMany({ where: { is_active: true } });
        for (const rule of dbRules) {
          const kw = rule.keyword.toLowerCase();
          if ((rule.match_type === 'exact' && msg === kw) ||
              (rule.match_type === 'contains' && msg.includes(kw))) {
            return { text: rule.response, source: 'db_rule' };
          }
        }
      }
    } catch (e) {}

    // 3. Si no hay Gemini API Key configurada, devolver el menú de bienvenida
    if (!genAI || !config.GEMINI_API_KEY) {
      const menuRule = ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu');
      return { text: menuRule.response, source: 'fallback' };
    }

    // 4. Si es una pregunta libre, invocar a Gemini con el System Prompt oficial de CLIPOP
    let history = [];
    if (prisma && leadId) {
      try {
        const pastConvs = await prisma.conversation.findMany({
          where: { leadId },
          orderBy: { timestamp: 'desc' },
          take: 6
        });
        pastConvs.reverse();
        history = pastConvs.map(c => ({
          role: c.sender === 'user' ? 'user' : 'model',
          parts: [{ text: c.message }]
        }));
      } catch (err) {}
    }

    try {
      const model = genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: SYSTEM_PROMPT
      });

      const chat = model.startChat({
        history: history.slice(0, -1)
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      return {
        text: response.text(),
        source: 'gemini'
      };
    } catch (error) {
      console.error('[Agent Gemini Error]', error.message);
      const menuRule = ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu');
      return { text: menuRule.response, source: 'error_fallback' };
    }
  }
}

module.exports = new AgentOrchestrator();
