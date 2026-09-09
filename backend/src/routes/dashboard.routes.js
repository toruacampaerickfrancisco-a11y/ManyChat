const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/dashboard/stats', dashboardController.getDashboardStats);

module.exports = router;
