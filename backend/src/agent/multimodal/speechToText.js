const config = require('../../config/env');

let groq = null;
if (config.GROQ_API_KEY) {
  try {
    const Groq = require('groq-sdk');
    groq = new Groq({ apiKey: config.GROQ_API_KEY });
  } catch (e) {
    console.warn('[STT] Groq SDK no disponible:', e.message);
  }
}

async function transcribeAudioBuffer(audioBuffer, filename = 'voice_note.ogg') {
  if (!groq || !config.GROQ_API_KEY) {
    console.warn('[STT] GROQ_API_KEY no configurada. Omitiendo transcripción de audio.');
    return null;
  }

  try {
    const Groq = require('groq-sdk');
    const file = await Groq.toFile(audioBuffer, filename, { type: 'audio/ogg' });
    const transcription = await groq.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3',
      language: 'es',
      temperature: 0.0
    });

    return transcription.text;
  } catch (error) {
    console.error('[STT Whisper Error]', error.message);
    return null;
  }
}

module.exports = {
  transcribeAudioBuffer
};
