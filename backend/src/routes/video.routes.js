const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');

router.post('/generate', videoController.createVideo);
router.get('/status/:jobId', videoController.getStatus);
router.get('/library', videoController.getLibrary);

module.exports = router;
