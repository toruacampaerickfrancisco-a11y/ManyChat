const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');

// Settings
router.get('/settings', settingsController.getSettings);
router.post('/settings', settingsController.updateSettings);

// Rules
router.get('/rules', settingsController.getRules);
router.post('/rules', settingsController.createRule);
router.delete('/rules/:id', settingsController.deleteRule);

module.exports = router;
