const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads.controller');

router.get('/', leadsController.getLeads);
router.get('/:id', leadsController.getLeadById);
router.post('/:id/pause', leadsController.togglePause);
router.post('/:id/toggle-bot', leadsController.togglePause);
router.post('/:id/status', leadsController.changeStatus);
router.post('/:id/messages', leadsController.addHumanMessage);
router.post('/:id/conversations', leadsController.addHumanMessage);

module.exports = router;
