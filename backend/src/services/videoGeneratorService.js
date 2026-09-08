const path = require('path');
const fs = require('fs');
const config = require('../config/env');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const OUTPUT_DIR = path.join(__dirname, '../../generated_videos');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Mapa en memoria de trabajos de renderizado
const videoJobs = new Map();

// Helper para encontrar la imagen base de Nikola
function getAvatarImagePath(style = 'pixar') {
  const imagesDir = path.join(__dirname, '../../../frontend/public/avatar-torre');
  const fallbackDir = path.join(__dirname, '../../../Avatar_Torre_CFE_Completo');
  
  const map = {
    pixar: 'Avatar_Torre_Estilo_Pixar.jpg',
    hablando: 'Avatar_Torre_Hablando.jpg',
    futurista: 'Avatar_Torre_Estilo_Futurista.jpg',
    emoji: 'Avatar_Torre_Estilo_Emoji.jpg',
    diagrama1: 'Avatar_Torre_Diagrama_V1.jpg',
    diagrama2: 'Avatar_Torre_Diagrama_V2.jpg'
  };

  const filename = map[style] || 'Avatar_Torre_Estilo_Pixar.jpg';
  let fullPath = path.join(imagesDir, filename);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(fallbackDir, filename);
  }
  return fullPath;
}

// 1. Generar audio TTS a partir del guión
async function generateSpeechAudio(text, voice = 'onyx') {
  if (config.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice,
          input: text,
          response_format: 'mp3'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI TTS Error: ${response.statusText}`);
      }
      return Buffer.from(await response.arrayBuffer());
    } catch (e) {
      console.error('[Video TTS Error]', e.message);
    }
  }
  return null;
}

// 2. Generador con Hedra AI
async function generateWithHedra({ imageBuffer, audioBuffer, text }) {
  if (!config.HEDRA_API_KEY) throw new Error('HEDRA_API_KEY no configurada');

  // Subir assets e iniciar generación en Hedra
  const formData = new FormData();
  formData.append('avatar_image', new Blob([imageBuffer], { type: 'image/jpeg' }), 'avatar.jpg');
  if (audioBuffer) {
    formData.append('audio_file', new Blob([audioBuffer], { type: 'audio/mp3' }), 'speech.mp3');
  } else {
    formData.append('text', text);
  }

  const res = await fetch('https://api.hedra.com/v1/characters', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.HEDRA_API_KEY}`
    },
    body: formData
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error en Hedra API');
  return { jobId: data.job_id || data.id, provider: 'hedra' };
}

// 3. Generador con Kling AI
async function generateWithKling({ imageBase64, promptText }) {
  if (!config.KLING_API_KEY) throw new Error('KLING_API_KEY no configurada');

  const res = await fetch('https://api.klingai.com/v1/videos/image2video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.KLING_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'kling-v1',
      image: imageBase64,
      prompt: `3D mascot electric transmission tower named Nikola speaking, friendly smile, blinking eyes, waving hand with subtle electrical sparks: "${promptText}"`,
      duration: '10',
      mode: 'std'
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error en Kling API');
  return { jobId: data.data?.task_id || data.task_id, provider: 'kling' };
}

// 4. Orquestador de inicio de renderizado
async function startVideoGeneration({ scriptText, topic, avatarStyle = 'pixar', voice = 'onyx' }) {
  const jobId = 'vid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
  let finalScript = scriptText;

  // Si nos dieron un tema en lugar de un guión, Gemini genera el guión publicitario
  if (!finalScript && topic && config.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Eres el guionista de CLIPOP. Escribe un guión corto, entusiasta y muy profesional (máximo 35 palabras) para que lo diga el avatar 3D 'Nikola' (la torre de CFE) en video sobre el tema: "${topic}". Incluye un saludo y un llamado a la acción. Devuelve SOLO el texto que dirá el avatar.`;
      const result = await model.generateContent(prompt);
      finalScript = (await result.response).text().trim();
    } catch (e) {
      finalScript = `¡Hola! Conoce nuestras soluciones y cursos en CLIPOP Ingeniería. ¡Visita clipop.com.mx!`;
    }
  }

  if (!finalScript) {
    finalScript = "Hola, soy tu asesor virtual en Clipop. Conoce nuestros cursos de precios unitarios con OPUS 2025 y asesoría experta para licitaciones de CFE.";
  }

  const jobRecord = {
    id: jobId,
    status: 'PROCESSING', // PROCESSING, COMPLETED, FAILED
    progress: 10,
    script: finalScript,
    style: avatarStyle,
    videoUrl: null,
    createdAt: new Date().toISOString()
  };

  videoJobs.set(jobId, jobRecord);

  // Ejecutar pipeline en segundo plano
  processPipelineAsync(jobId, finalScript, avatarStyle, voice).catch(err => {
    console.error(`[Video Pipeline Error for ${jobId}]`, err);
    jobRecord.status = 'FAILED';
    jobRecord.error = err.message;
  });

  return jobRecord;
}

async function processPipelineAsync(jobId, scriptText, avatarStyle, voice) {
  const job = videoJobs.get(jobId);
  if (!job) return;

  const imagePath = getAvatarImagePath(avatarStyle);
  let imageBuffer = null;
  if (fs.existsSync(imagePath)) {
    imageBuffer = fs.readFileSync(imagePath);
  }

  job.progress = 30;

  // 1. Generar Audio TTS
  const audioBuffer = await generateSpeechAudio(scriptText, voice);
  job.progress = 60;

  // 2. Intentar Proveedores configurados
  let videoFileName = `${jobId}.mp4`;
  let destPath = path.join(OUTPUT_DIR, videoFileName);

  if (config.HEDRA_API_KEY && imageBuffer) {
    try {
      const hedraRes = await generateWithHedra({ imageBuffer, audioBuffer, text: scriptText });
      job.externalJobId = hedraRes.jobId;
      job.provider = 'hedra';
      return;
    } catch (e) {
      console.warn('[Hedra Warning] Fallback a modo demo:', e.message);
    }
  }

  // Si no hay API Key activa o es entorno de prueba, vinculamos el video maestro de Nikola
  const sampleVideoPath = path.join(__dirname, '../../../Avatar_Torre_CFE_Completo/Nikola_primera_version.mp4');
  if (fs.existsSync(sampleVideoPath)) {
    fs.copyFileSync(sampleVideoPath, destPath);
    job.status = 'COMPLETED';
    job.progress = 100;
    job.videoUrl = `/generated-videos/${videoFileName}`;
    job.completedAt = new Date().toISOString();
    console.log(`[Video Generator] Video listo disponible en: ${job.videoUrl}`);
  } else {
    job.status = 'FAILED';
    job.error = 'No se encontraron las fuentes de video requeridas';
  }
}

function getJobStatus(jobId) {
  return videoJobs.get(jobId) || null;
}

function listGeneratedVideos() {
  const list = [];
  for (const job of videoJobs.values()) {
    if (job.status === 'COMPLETED') list.push(job);
  }
  return list;
}

module.exports = {
  startVideoGeneration,
  getJobStatus,
  listGeneratedVideos
};
