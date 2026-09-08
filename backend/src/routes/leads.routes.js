const express = require('express');
const router = express.Router();
const leadsController = require('../controllers/leads.controller');

router.get('/', leadsController.getLeads);
router.get('/:id', leadsController.getLeadById);
router.post('/:id/pause', leadsController.togglePause);
router.post('/:id/messages', leadsController.addHumanMessage);

module.exports = router;
