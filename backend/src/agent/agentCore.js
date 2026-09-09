const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const { prisma } = require('../config/database');
const { SYSTEM_PROMPT, ORIGINAL_BOT_RULES } = require('../config/constants');

let genAI = null;
if (config.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
}

function adaptLinksForPlatform(text, platform = 'whatsapp') {
  if (!text) return text;
  const plat = (platform || 'whatsapp').toLowerCase();
  let lines = text.split('\n');

  lines = lines.filter(line => {
    // En WhatsApp, quitar el enlace de WhatsApp Directo
    if (plat === 'whatsapp') {
      if (line.includes('wa.me') || line.includes('WhatsApp Directo') || line.includes('WhatsApp Asesor') || line.includes('WhatsApp:')) return false;
    }
    // En Facebook / Messenger, quitar el enlace de Facebook
    if (plat === 'messenger' || plat === 'facebook' || plat === 'page') {
      if (line.includes('facebook.com') || line.includes('Facebook Clipop') || line.includes('Facebook:')) return false;
    }
    // En Instagram, quitar el enlace de Instagram
    if (plat === 'instagram') {
      if (line.includes('instagram.com') || line.includes('Instagram Clipop') || line.includes('Instagram:')) return false;
    }
    return true;
  });

  // Limpiar separadores horizontales tipo " | " cuando se elimina un ítem
  return lines.map(line => {
    if (line.includes('━━━━━━━━━━━━━━━━━━━')) return line;
    if (line.includes('|')) {
      const parts = line.split('|').map(p => p.trim()).filter(p => {
        if (plat === 'whatsapp' && (p.includes('wa.me') || p.includes('WhatsApp'))) return false;
        if ((plat === 'messenger' || plat === 'facebook' || plat === 'page') && p.includes('facebook.com')) return false;
        if (plat === 'instagram' && p.includes('instagram.com')) return false;
        return p.length > 0;
      });
      return parts.join(' | ');
    }
    return line;
  }).join('\n');
}

async function getDynamicFlowResponse(key, fallbackText) {
  try {
    if (prisma) {
      const setting = await prisma.setting.findUnique({
        where: { key: `bot_${key}_text` }
      });
      if (setting && setting.value && setting.value.trim().length > 0) {
        return setting.value;
      }
    }
  } catch (e) {}
  return fallbackText;
}

class AgentOrchestrator {
  constructor() {
    this.modelName = 'gemini-1.5-flash';
  }

  async processMessage({ leadId, platform = 'whatsapp', phoneOrId, senderName, userMessage }) {
    const rawMsg = (userMessage || '').trim();
    const msg = rawMsg.toLowerCase();
    const cleanMsg = msg.replace(/[!¡?¿,.\-_#*]/g, '').trim();

    if (!cleanMsg) {
      const defaultMenu = ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu')?.response || '';
      const responseText = await getDynamicFlowResponse('flow_menu', defaultMenu);
      return { 
        text: adaptLinksForPlatform(responseText, platform), 
        source: 'fallback',
        isWelcome: true
      };
    }

    // 1. EVALUACIÓN PRIORITARIA DE REGLAS (Con soporte para personalización desde el Panel)
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
      const defaultMenu = ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu')?.response || '';
      const responseText = await getDynamicFlowResponse('flow_menu', defaultMenu);
      return { 
        text: adaptLinksForPlatform(responseText, platform), 
        source: 'rule',
        isWelcome: true
      };
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
      const defaultR1 = ORIGINAL_BOT_RULES.find(r => r.id === 6)?.response || '';
      const responseText = await getDynamicFlowResponse('flow_option1', defaultR1);
      return { text: adaptLinksForPlatform(responseText, platform), source: 'rule' };
    }

    // C. Opción 2: Cursos en tiempo real (Teams)
    if (
      cleanMsg === '2' ||
      cleanMsg === '2️⃣' ||
      /^(2|2️⃣|2\.|opci[oó]n 2|cursos? en tiempo real|teams|virtual|virtuales|en vivo)$/i.test(cleanMsg) ||
      cleanMsg.includes('teams') ||
      cleanMsg.includes('tiempo real')
    ) {
      const defaultR2 = ORIGINAL_BOT_RULES.find(r => r.id === 9)?.response || '';
      const responseText = await getDynamicFlowResponse('flow_option2', defaultR2);
      return { text: adaptLinksForPlatform(responseText, platform), source: 'rule' };
    }

    // D. Opción 3: Cursos presenciales (Hermosillo)
    if (
      cleanMsg === '3' ||
      cleanMsg === '3️⃣' ||
      /^(3|3️⃣|3\.|opci[oó]n 3|cursos? presenciales?|presencial|hermosillo|sonora)$/i.test(cleanMsg) ||
      cleanMsg.includes('presencial') ||
      cleanMsg.includes('hermosillo')
    ) {
      const defaultR3 = ORIGINAL_BOT_RULES.find(r => r.id === 12)?.response || '';
      const responseText = await getDynamicFlowResponse('flow_option3', defaultR3);
      return { text: adaptLinksForPlatform(responseText, platform), source: 'rule' };
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
      const defaultR4 = ORIGINAL_BOT_RULES.find(r => r.id === 15)?.response || '';
      const responseText = await getDynamicFlowResponse('flow_option4', defaultR4);
      return { text: adaptLinksForPlatform(responseText, platform), source: 'rule' };
    }

    // F. Flujo "¿Tienes alguna otra duda?": 'Sí'
    if (
      cleanMsg === 'si' ||
      cleanMsg === 'sí' ||
      /^(s[ií]|s[ií] por favor|s[ií] claro|s[ií] tengo dudas?|tengo una duda|otra duda|duda|dudas)$/i.test(cleanMsg)
    ) {
      const defaultSi = ORIGINAL_BOT_RULES.find(r => r.keyword === 'si')?.response || '';
      const responseText = await getDynamicFlowResponse('flow_si', defaultSi);
      return { text: adaptLinksForPlatform(responseText, platform), source: 'rule' };
    }

    // G. Flujo "¿Tienes alguna otra duda?": 'No'
    if (
      cleanMsg === 'no' ||
      /^(no|no gracias|ninguna|nada|todo bien|todo claro|gracias|muchas gracias|adi[oó]s|bye)$/i.test(cleanMsg)
    ) {
      const defaultNo = ORIGINAL_BOT_RULES.find(r => r.keyword === 'no')?.response || '';
      const responseText = await getDynamicFlowResponse('flow_no', defaultNo);
      return { text: adaptLinksForPlatform(responseText, platform), source: 'rule' };
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
      const defaultAsesor = ORIGINAL_BOT_RULES.find(r => r.id === 21)?.response || '';
      const responseText = await getDynamicFlowResponse('flow_asesor', defaultAsesor);
      return { text: adaptLinksForPlatform(responseText, platform), source: 'rule' };
    }

    // 2. Verificar reglas adicionales configuradas en la base de datos
    try {
      if (prisma) {
        const dbRules = await prisma.botRule.findMany({ where: { is_active: true } });
        for (const rule of dbRules) {
          const kw = rule.keyword.toLowerCase();
          if ((rule.match_type === 'exact' && msg === kw) ||
              (rule.match_type === 'contains' && msg.includes(kw))) {
            return { text: adaptLinksForPlatform(rule.response, platform), source: 'db_rule' };
          }
        }
      }
    } catch (e) {}

    // 3. Si no hay Gemini API Key configurada, devolver el menú de bienvenida
    if (!genAI || !config.GEMINI_API_KEY) {
      const menuRule = ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu');
      return { 
        text: adaptLinksForPlatform(menuRule.response, platform), 
        source: 'fallback',
        isWelcome: true
      };
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
        text: adaptLinksForPlatform(response.text(), platform),
        source: 'gemini'
      };
    } catch (error) {
      console.error('[Agent Gemini Error]', error.message);
      const menuRule = ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu');
      return { 
        text: adaptLinksForPlatform(menuRule.response, platform), 
        source: 'error_fallback',
        isWelcome: true
      };
    }
  }
}

module.exports = new AgentOrchestrator();
