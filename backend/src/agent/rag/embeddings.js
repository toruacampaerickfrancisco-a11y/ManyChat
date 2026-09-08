const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config/env');

let genAI = null;
if (config.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
}

async function generateEmbedding(text) {
  if (!genAI || !config.GEMINI_API_KEY) return null;
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.warn('[Embedding Error]', error.message);
    return null;
  }
}

module.exports = {
  generateEmbedding
};
