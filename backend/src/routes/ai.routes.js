const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  getCandidateMatches,
  assistantChat,
  createInterviewSession,
  submitInterviewAnswer,
  getInterviewFeedback
} = require('../controllers/ai.controller');

const router = express.Router();

router.get('/matches/me', authenticate, authorize('candidate'), getCandidateMatches);
router.post('/assistant/chat', authenticate, assistantChat);

router.post('/interview/sessions', authenticate, authorize('candidate'), createInterviewSession);
router.post('/interview/sessions/:id/answer', authenticate, authorize('candidate'), submitInterviewAnswer);
router.get('/interview/sessions/:id/feedback', authenticate, authorize('candidate'), getInterviewFeedback);

module.exports = router;
