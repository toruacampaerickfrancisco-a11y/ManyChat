const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');

router.get('/media', mediaController.getMediaList);
router.post('/media/upload', mediaController.upload.single('file'), mediaController.uploadMediaFile);
router.delete('/media/:filename', mediaController.deleteMediaFile);

module.exports = router;
