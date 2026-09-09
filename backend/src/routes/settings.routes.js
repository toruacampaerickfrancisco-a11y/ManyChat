const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');

// Settings
router.get('/settings', settingsController.getSettings);
router.post('/settings', settingsController.updateSettings);

// Bot Flow Studio & Core Flows
router.get('/bot/flows', settingsController.getBotFlows);
router.post('/bot/flows/save-core', settingsController.saveCoreFlow);
router.post('/bot/flows/reset-core', settingsController.resetCoreFlow);

// Custom Rules
router.get('/rules', settingsController.getRules);
router.post('/rules', settingsController.createRule);
router.delete('/rules/:id', settingsController.deleteRule);

module.exports = router;

