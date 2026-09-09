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
    const cleanMsg = msg.replace(/[!¡?¿,.\-_#*]/g, '').trim();

    if (!cleanMsg) {
      const menuRule = ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu');
      return { text: menuRule.response, source: 'fallback' };
    }

    // 1. EVALUACIÓN PRIORITARIA DE REGLAS EXACTAS ORIGINALES DE CLIPOP
    // A. Menú Principal (0, hola, menu, inicio, buenas)
    if (
      cleanMsg === '0' ||
      cleanMsg === '0️⃣' ||
      cleanMsg === 'menu' ||
      cleanMsg === 'menú' ||
      cleanMsg === 'inicio' ||
      cleanMsg === 'volver' ||
      cleanMsg === 'empezar' ||
      cleanMsg === 'info' ||
      cleanMsg === 'informacion' ||
      cleanMsg === 'informes' ||
      cleanMsg === 'servicios' ||
      cleanMsg === 'ayuda' ||
      cleanMsg.startsWith('hola') ||
      cleanMsg.startsWith('buenas') ||
      cleanMsg.startsWith('buenos dias') ||
      cleanMsg.startsWith('buenas tardes') ||
      cleanMsg.startsWith('buenas noches') ||
      /^(0|0️⃣|menu|menú|inicio|volver|hola|empezar|welcome_message|get started|buenas|buenos dias|buenas tardes|buenas noches|informes?|info|servicios?)$/i.test(cleanMsg)
    ) {
      const menuRule = ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu');
      return { text: menuRule.response, source: 'rule' };
    }

    // B. Opción 1: Cursos pregrabados (Udemy)
    if (
      cleanMsg === '1' ||
      cleanMsg === '1️⃣' ||
      /^(1|1️⃣|1\.|opci[oó]n 1|cursos? pregrabados?|udemy|pregrabados?|cursos?|curso opus|opus|precios unitarios|costos)$/i.test(cleanMsg) ||
      cleanMsg.includes('pregrabado') ||
      cleanMsg.includes('udemy') ||
      cleanMsg.includes('precios unitarios') ||
      cleanMsg.includes('curso opus') ||
      cleanMsg.includes('cursos opus')
    ) {
      const r1 = ORIGINAL_BOT_RULES.find(r => r.id === 6);
      return { text: r1.response, source: 'rule' };
    }

    // C. Opción 2: Cursos en tiempo real (Teams)
    if (
      cleanMsg === '2' ||
      cleanMsg === '2️⃣' ||
      /^(2|2️⃣|2\.|opci[oó]n 2|cursos? en tiempo real|teams|virtual|virtuales|en vivo)$/i.test(cleanMsg) ||
      cleanMsg.includes('teams') ||
      cleanMsg.includes('tiempo real')
    ) {
      const r2 = ORIGINAL_BOT_RULES.find(r => r.id === 9);
      return { text: r2.response, source: 'rule' };
    }

    // D. Opción 3: Cursos presenciales (Hermosillo)
    if (
      cleanMsg === '3' ||
      cleanMsg === '3️⃣' ||
      /^(3|3️⃣|3\.|opci[oó]n 3|cursos? presenciales?|presencial|hermosillo|sonora)$/i.test(cleanMsg) ||
      cleanMsg.includes('presencial') ||
      cleanMsg.includes('hermosillo')
    ) {
      const r3 = ORIGINAL_BOT_RULES.find(r => r.id === 12);
      return { text: r3.response, source: 'rule' };
    }

    // E. Opción 4: Cotización de proyectos
    if (
      cleanMsg === '4' ||
      cleanMsg === '4️⃣' ||
      /^(4|4️⃣|4\.|opci[oó]n 4|cotizaci[oó]n|cotizar|proyectos?|media tensi[oó]n|alta tensi[oó]n|subestaci[oó]n|cfe)$/i.test(cleanMsg) ||
      cleanMsg.includes('cotiz') ||
      cleanMsg.includes('media tension') ||
      cleanMsg.includes('alta tension')
    ) {
      const r4 = ORIGINAL_BOT_RULES.find(r => r.id === 15);
      return { text: r4.response, source: 'rule' };
    }

    // F. Flujo "¿Tienes alguna otra duda?": 'Sí'
    if (
      cleanMsg === 'si' ||
      cleanMsg === 'sí' ||
      /^(s[ií]|s[ií] por favor|s[ií] claro|s[ií] tengo dudas?|tengo una duda|otra duda|duda|dudas)$/i.test(cleanMsg)
    ) {
      const rSi = ORIGINAL_BOT_RULES.find(r => r.keyword === 'si');
      return { text: rSi.response, source: 'rule' };
    }

    // G. Flujo "¿Tienes alguna otra duda?": 'No'
    if (
      cleanMsg === 'no' ||
      /^(no|no gracias|ninguna|nada|todo bien|todo claro|gracias|muchas gracias|adi[oó]s|bye)$/i.test(cleanMsg)
    ) {
      const rNo = ORIGINAL_BOT_RULES.find(r => r.keyword === 'no');
      return { text: rNo.response, source: 'rule' };
    }

    // H. Contacto con Asesor Humano
    if (
      cleanMsg.includes('asesor') ||
      cleanMsg.includes('humano') ||
      cleanMsg.includes('persona') ||
      cleanMsg.includes('operador') ||
      cleanMsg.includes('francisco') ||
      cleanMsg.includes('contacto') ||
      cleanMsg.includes('telefono') ||
      cleanMsg.includes('teléfono') ||
      cleanMsg.includes('hablar con')
    ) {
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
