const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const { listUsers, dashboardMetrics } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/users', authenticate, authorize('admin'), listUsers);
router.get('/metrics', authenticate, authorize('admin'), dashboardMetrics);

module.exports = router;
