const videoService = require('../services/videoGeneratorService');

async function createVideo(req, res) {
  const { script, topic, style, voice } = req.body;
  try {
    const job = await videoService.startVideoGeneration({
      scriptText: script,
      topic,
      avatarStyle: style,
      voice
    });
    res.status(202).json({
      success: true,
      message: 'Generación de video iniciada',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getStatus(req, res) {
  const { jobId } = req.params;
  const job = videoService.getJobStatus(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Trabajo de video no encontrado' });
  }
  res.json({ success: true, job });
}

async function getLibrary(req, res) {
  const library = videoService.listGeneratedVideos();
  res.json({ success: true, count: library.length, videos: library });
}

module.exports = {
  createVideo,
  getStatus,
  getLibrary
};
