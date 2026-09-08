const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const { prisma } = require('../config/database');
const { buildAgentSystemPrompt } = require('./systemPrompts');
const { toolDeclarations } = require('./tools/toolDefinitions');
const quotationTool = require('./tools/quotationTool');
const calendarTool = require('./tools/calendarTool');
const catalogTool = require('./tools/catalogTool');
const handoverTool = require('./tools/handoverTool');
const { searchSimilarDocuments } = require('./rag/vectorStore');

let genAI = null;
if (config.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
}

class AgentOrchestrator {
  constructor() {
    this.modelName = 'gemini-1.5-flash';
  }

  async processMessage({ leadId, platform, phoneOrId, senderName, userMessage }) {
    // 1. Verificar si hay un short-circuit por regla rápida (BotRule)
    try {
      if (prisma) {
        const rules = await prisma.botRule.findMany({ where: { is_active: true } });
        const cleanMsg = (userMessage || '').trim().toLowerCase();
        for (const rule of rules) {
          const kw = rule.keyword.toLowerCase();
          if ((rule.match_type === 'exact' && cleanMsg === kw) ||
              (rule.match_type === 'contains' && cleanMsg.includes(kw))) {
            console.log(`[Agent Rule Triggered] Regla '${rule.keyword}' activada.`);
            return {
              text: rule.response,
              source: 'rule'
            };
          }
        }
      }
    } catch (e) {
      console.warn('[Agent Rule Warning]', e.message);
    }

    // 2. Si no hay Gemini API Key, responder con fallback cordial
    if (!genAI || !config.GEMINI_API_KEY) {
      return {
        text: `Hola${senderName ? ' ' + senderName : ''}, ¡gracias por comunicarte con CLIPOP! ⚡\n\nSomos especialistas en proyectos de ingeniería eléctrica (líneas y subestaciones de CFE) y análisis de precios unitarios (OPUS/Neodata). ¿En qué podemos asesorarte hoy?`,
        source: 'fallback'
      };
    }

    // 3. Obtener contexto semántico RAG si aplica
    let ragContext = '';
    try {
      const docs = await searchSimilarDocuments(userMessage, 2);
      if (docs && docs.length > 0) {
        ragContext = docs.map(d => `[Fuente: ${d.title}]\n${d.content}`).join('\n\n');
      }
    } catch (e) {}

    // 4. Construir System Prompt e Historial
    const systemInstruction = buildAgentSystemPrompt(ragContext);

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

    // 5. Instanciar Modelo de Gemini con Tools
    try {
      const model = genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction,
        tools: [{ functionDeclarations: toolDeclarations }]
      });

      const chat = model.startChat({
        history: history.slice(0, -1) // No duplicar el mensaje actual si ya se guardó
      });

      let result = await chat.sendMessage(userMessage);
      let response = await result.response;
      let functionCalls = response.functionCalls();

      // 6. Bucle de resolución de herramientas (Function Calling)
      while (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          const { name, args } = call;
          console.log(`[Agent Function Call] Invocando tool: ${name} con args:`, args);

          let toolResult = null;
          if (name === 'cotizarProyecto') {
            toolResult = await quotationTool.execute(leadId, args);
          } else if (name === 'agendarAsesoria') {
            toolResult = await calendarTool.execute(leadId, args);
          } else if (name === 'consultarCursos') {
            toolResult = await catalogTool.execute(leadId, args);
          } else if (name === 'escalarAAgenteHumano') {
            toolResult = await handoverTool.execute(leadId, args);
          }

          // Reinyectar resultado a la sesión de chat
          result = await chat.sendMessage([
            {
              functionResponse: {
                name,
                response: toolResult || { status: 'completado' }
              }
            }
          ]);
          response = await result.response;
          functionCalls = response.functionCalls();
        }
      }

      const replyText = response.text();
      return {
        text: replyText,
        source: 'gemini'
      };
    } catch (error) {
      console.error('[Agent Gemini Error]', error.message);
      return {
        text: `Hola${senderName ? ' ' + senderName : ''}, un gusto saludarte. Hemos recibido tu mensaje en CLIPOP Ingeniería. En breve uno de nuestros asesores técnicos te atenderá a detalle. ⚡`,
        source: 'error_fallback'
      };
    }
  }
}

module.exports = new AgentOrchestrator();
