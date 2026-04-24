const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const protectedRoutes = require('./protected.routes');
const profileRoutes = require('./profile.routes');
const jobsRoutes = require('./jobs.routes');
const aiRoutes = require('./ai.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/jobs', jobsRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);
router.use('/', protectedRoutes);

module.exports = router;
