const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config/env');

let genAI = null;
if (config.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
}

async function analyzeTechnicalImage(imageBuffer, mimeType = 'image/jpeg', userPrompt = '') {
  if (!genAI || !config.GEMINI_API_KEY) {
    return 'Imagen recibida. (El módulo de visión de Gemini requiere GEMINI_API_KEY).';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType
      }
    };

    const prompt = userPrompt 
      ? `Eres el asesor técnico de CLIPOP. Analiza esta imagen técnica/documento (plano, cotización, diagrama o recibo de CFE) en respuesta al usuario: "${userPrompt}"`
      : `Eres el asesor técnico de CLIPOP. Describe y analiza técnicamente esta imagen (identifica si es un plano eléctrico, diagrama unifilar, catálogo de conceptos, recibo de CFE o cotización) y extrae los datos clave relevantes.`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('[Vision Service Error]', error.message);
    return 'Hemos recibido tu imagen/documento técnico correctamente. Un ingeniero la revisará a detalle.';
  }
}

module.exports = {
  analyzeTechnicalImage
};
