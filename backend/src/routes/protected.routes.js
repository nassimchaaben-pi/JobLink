const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/candidate/dashboard', authenticate, authorize('candidate'), (req, res) => {
  return res.status(200).json({ message: 'Candidate dashboard placeholder.', user: req.user });
});

router.get('/recruiter/dashboard', authenticate, authorize('recruiter'), (req, res) => {
  return res.status(200).json({ message: 'Recruiter dashboard placeholder.', user: req.user });
});

router.get('/admin/dashboard', authenticate, authorize('admin'), (req, res) => {
  return res.status(200).json({ message: 'Admin dashboard placeholder.', user: req.user });
});

module.exports = router;
