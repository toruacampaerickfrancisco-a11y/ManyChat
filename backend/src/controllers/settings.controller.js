const { prisma } = require('../config/database');
const { ORIGINAL_BOT_RULES } = require('../config/constants');

let inMemorySettings = {
  podcast_is_live: 'false',
  podcast_live_url: '',
  login_bg_color: '#6b2143'
};

const CORE_FLOW_DEFS = [
  {
    key: 'flow_menu',
    title: 'Menú Principal & Bienvenida',
    subtitle: 'Respuesta inicial cuando el usuario saluda o escribe 0 / menu',
    keywords: '0, menu, menú, hola, inicio, empezar',
    defaultResponse: ORIGINAL_BOT_RULES.find(r => r.keyword === 'menu')?.response || '',
    mediaType: 'video',
    defaultMediaUrl: '/avatar-torre/nikola_bienvenida.mp4'
  },
  {
    key: 'flow_option1',
    title: 'Opción 1: Cursos Pregrabados (Udemy)',
    subtitle: 'Catálogo de cursos oficiales en Udemy con precios y enlaces',
    keywords: '1, pregrabados, udemy, cursos, opus, precios unitarios',
    defaultResponse: ORIGINAL_BOT_RULES.find(r => r.id === 6)?.response || '',
    mediaType: 'none',
    defaultMediaUrl: ''
  },
  {
    key: 'flow_option2',
    title: 'Opción 2: Cursos en Tiempo Real (Teams)',
    subtitle: 'Información de cursos virtuales en Teams y convocatorias',
    keywords: '2, teams, tiempo real, virtual, en vivo',
    defaultResponse: ORIGINAL_BOT_RULES.find(r => r.id === 9)?.response || '',
    mediaType: 'none',
    defaultMediaUrl: ''
  },
  {
    key: 'flow_option3',
    title: 'Opción 3: Cursos Presenciales (Hermosillo)',
    subtitle: 'Sedes presenciales en Hermosillo y opciones foráneas',
    keywords: '3, presencial, presenciales, hermosillo, sonora',
    defaultResponse: ORIGINAL_BOT_RULES.find(r => r.id === 12)?.response || '',
    mediaType: 'none',
    defaultMediaUrl: ''
  },
  {
    key: 'flow_option4',
    title: 'Opción 4: Cotización Media / Alta Tensión',
    subtitle: 'Instrucciones para envío de planos, conceptos y especificaciones',
    keywords: '4, cotizacion, cotizar, proyectos, media tension, alta tension',
    defaultResponse: ORIGINAL_BOT_RULES.find(r => r.id === 15)?.response || '',
    mediaType: 'none',
    defaultMediaUrl: ''
  },
  {
    key: 'flow_si',
    title: 'Flujo "¿Tienes dudas?": Sí',
    subtitle: 'Menú orientativo cuando el cliente indica que tiene más dudas',
    keywords: 'si, sí, duda, dudas, tengo una duda',
    defaultResponse: ORIGINAL_BOT_RULES.find(r => r.keyword === 'si')?.response || '',
    mediaType: 'none',
    defaultMediaUrl: ''
  },
  {
    key: 'flow_no',
    title: 'Flujo "¿Tienes dudas?": No (Despedida)',
    subtitle: 'Mensaje de agradecimiento y éxito en proyectos',
    keywords: 'no, no gracias, ninguna, todo bien, adios, bye',
    defaultResponse: ORIGINAL_BOT_RULES.find(r => r.keyword === 'no')?.response || '',
    mediaType: 'none',
    defaultMediaUrl: ''
  },
  {
    key: 'flow_asesor',
    title: 'Flujo Asesor Humano',
    subtitle: 'Pausa automática del bot y contacto directo con el equipo de soporte',
    keywords: 'asesor, humano, persona, operador, francisco, contacto, telefono',
    defaultResponse: ORIGINAL_BOT_RULES.find(r => r.id === 21)?.response || '',
    mediaType: 'none',
    defaultMediaUrl: ''
  }
];

async function getSettings(req, res) {
  try {
    if (prisma) {
      const settings = await prisma.setting.findMany();
      const settingsMap = {};
      settings.forEach(s => {
        settingsMap[s.key] = s.value;
      });
      return res.json(settingsMap);
    }
  } catch (error) {
    console.warn('[Settings Controller Warning]', error.message);
  }
  res.json(inMemorySettings);
}

async function updateSettings(req, res) {
  try {
    const { settings } = req.body;
    if (!settings) return res.status(400).json({ error: 'Configuración requerida' });

    if (prisma) {
      for (const [key, value] of Object.entries(settings)) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) }
        });
      }
      return res.json({ success: true });
    }
  } catch (error) {
    console.warn('[Settings Update Warning]', error.message);
  }

  const { settings } = req.body;
  if (settings) {
    for (const [key, value] of Object.entries(settings)) {
      inMemorySettings[key] = String(value);
    }
  }
  res.json({ success: true });
}

// Obtener todos los flujos (Base Oficial + Personalizaciones en BD + Reglas Custom)
async function getBotFlows(req, res) {
  let settingsMap = { ...inMemorySettings };
  try {
    if (prisma) {
      const dbSettings = await prisma.setting.findMany().catch(() => []);
      dbSettings.forEach(s => { settingsMap[s.key] = s.value; });
    }
  } catch (e) {}

  const coreFlows = CORE_FLOW_DEFS.map(def => {
    const customText = settingsMap[`bot_${def.key}_text`];
    const customMediaUrl = settingsMap[`bot_${def.key}_media_url`];
    const isCustomized = Boolean(customText && customText !== def.defaultResponse);

    return {
      key: def.key,
      title: def.title,
      subtitle: def.subtitle,
      keywords: def.keywords,
      defaultResponse: def.defaultResponse,
      currentResponse: customText || def.defaultResponse,
      isCustomized,
      mediaType: def.mediaType,
      mediaUrl: customMediaUrl !== undefined ? customMediaUrl : def.defaultMediaUrl
    };
  });

  let customRules = [];
  try {
    if (prisma) {
      customRules = await prisma.botRule.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []);
    }
  } catch (e) {}

  res.json({
    success: true,
    coreFlows,
    customRules
  });
}

// Guardar o actualizar un flujo core
async function saveCoreFlow(req, res) {
  try {
    const { key, response, mediaUrl } = req.body;
    if (!key || response === undefined) {
      return res.status(400).json({ success: false, error: 'Faltan parámetros requeridos' });
    }

    if (prisma) {
      await prisma.setting.upsert({
        where: { key: `bot_${key}_text` },
        update: { value: response },
        create: { key: `bot_${key}_text`, value: response }
      });

      if (mediaUrl !== undefined) {
        await prisma.setting.upsert({
          where: { key: `bot_${key}_media_url` },
          update: { value: mediaUrl || '' },
          create: { key: `bot_${key}_media_url`, value: mediaUrl || '' }
        });
      }
    }

    inMemorySettings[`bot_${key}_text`] = response;
    if (mediaUrl !== undefined) inMemorySettings[`bot_${key}_media_url`] = mediaUrl;

    res.json({ success: true, message: 'Flujo actualizado correctamente' });
  } catch (error) {
    console.error('[Save Core Flow Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Restaurar un flujo core a su respuesta oficial original
async function resetCoreFlow(req, res) {
  try {
    const { key } = req.body;
    const def = CORE_FLOW_DEFS.find(d => d.key === key);
    if (!def) return res.status(404).json({ success: false, error: 'Flujo no encontrado' });

    if (prisma) {
      await prisma.setting.deleteMany({
        where: {
          key: { in: [`bot_${key}_text`, `bot_${key}_media_url`] }
        }
      });
    }

    delete inMemorySettings[`bot_${key}_text`];
    delete inMemorySettings[`bot_${key}_media_url`];

    res.json({
      success: true,
      message: 'Flujo restaurado a su valor oficial por defecto',
      defaultResponse: def.defaultResponse,
      defaultMediaUrl: def.defaultMediaUrl
    });
  } catch (error) {
    console.error('[Reset Core Flow Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getRules(req, res) {
  try {
    if (prisma) {
      const rules = await prisma.botRule.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.json(rules);
    }
  } catch (e) {}
  res.json([]);
}

async function createRule(req, res) {
  const { keyword, match_type, response } = req.body;
  if (!keyword || !response) {
    return res.status(400).json({ error: 'Palabra clave y respuesta requeridas' });
  }

  try {
    if (prisma) {
      const newRule = await prisma.botRule.create({
        data: {
          keyword,
          match_type: match_type || 'contains',
          response,
          is_active: true
        }
      });
      return res.status(201).json(newRule);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }

  res.status(201).json({ id: Date.now(), keyword, response, is_active: true });
}

async function deleteRule(req, res) {
  const { id } = req.params;
  try {
    if (prisma) {
      await prisma.botRule.delete({
        where: { id: parseInt(id, 10) }
      });
      return res.json({ success: true });
    }
  } catch (e) {}
  res.json({ success: true });
}

module.exports = {
  getSettings,
  updateSettings,
  getBotFlows,
  saveCoreFlow,
  resetCoreFlow,
  getRules,
  createRule,
  deleteRule
};

