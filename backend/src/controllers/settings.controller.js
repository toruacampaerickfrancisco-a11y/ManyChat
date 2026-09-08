const { prisma } = require('../config/database');

let inMemorySettings = {
  podcast_is_live: 'false',
  podcast_live_url: '',
  login_bg_color: '#6b2143'
};

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
  getRules,
  createRule,
  deleteRule
};
