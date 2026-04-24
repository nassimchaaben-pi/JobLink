const aiService = require('../services/ai.service');

async function getCandidateMatches(req, res, next) {
  try {
    const matches = await aiService.getCandidateMatches(req.user.sub);
    return res.status(200).json({ matches });
  } catch (error) {
    return next(error);
  }
}

async function assistantChat(req, res, next) {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Message is required.' });
    }

    if (message.trim().length < 2 || message.trim().length > 1000) {
      return res
        .status(400)
        .json({ code: 'VALIDATION_ERROR', message: 'Message must be between 2 and 1000 characters.' });
    }

    const result = await aiService.sendChatMessage(req.user.sub, message.trim());
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function createInterviewSession(req, res, next) {
  try {
    const session = await aiService.createInterviewSession(req.user.sub, req.body || {});
    return res.status(201).json({ session });
  } catch (error) {
    return next(error);
  }
}

async function submitInterviewAnswer(req, res, next) {
  try {
    const { questionIndex, answer } = req.body;
    if (questionIndex === undefined || answer === undefined) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'questionIndex and answer are required.' });
    }

    if (!Number.isInteger(Number(questionIndex)) || Number(questionIndex) < 0) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'questionIndex must be a non-negative integer.' });
    }

    if (typeof answer !== 'string' || answer.trim().length < 2 || answer.trim().length > 4000) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'answer must be between 2 and 4000 characters.' });
    }

    const session = await aiService.submitInterviewAnswer(req.user.sub, req.params.id, {
      questionIndex: Number(questionIndex),
      answer: answer.trim()
    });
    return res.status(200).json({ session });
  } catch (error) {
    return next(error);
  }
}

async function getInterviewFeedback(req, res, next) {
  try {
    const feedback = await aiService.generateInterviewFeedback(req.user.sub, req.params.id);
    return res.status(200).json({ feedback });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCandidateMatches,
  assistantChat,
  createInterviewSession,
  submitInterviewAnswer,
  getInterviewFeedback
};
