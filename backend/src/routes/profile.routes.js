const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const { getMyProfile, updateMyProfile } = require('../controllers/profile.controller');

const router = express.Router();

router.get('/me', authenticate, authorize('candidate'), getMyProfile);
router.put('/me', authenticate, authorize('candidate'), updateMyProfile);

module.exports = router;
