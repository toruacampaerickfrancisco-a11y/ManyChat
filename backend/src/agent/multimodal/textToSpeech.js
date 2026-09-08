const config = require('../../config/env');

async function synthesizeTextToAudio(text) {
  if (!config.OPENAI_API_KEY && !config.ELEVENLABS_API_KEY) {
    return null; // Omitir si no hay key de voz saliente configurada
  }

  try {
    if (config.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice: 'onyx',
          input: text,
          response_format: 'opus'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI TTS Error: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (error) {
    console.error('[TTS Synthesis Error]', error.message);
    return null;
  }
}

module.exports = {
  synthesizeTextToAudio
};
