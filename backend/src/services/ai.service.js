const prisma = require('../config/prisma');
const env = require('../config/env');
const { memoryDb, nextId } = require('../data/memory-db');
const { listJobs } = require('./jobs.service');
const { getCandidateProfileByUserId } = require('./profile.service');

function normalizeSkill(skill) {
  return String(skill || '')
    .trim()
    .toLowerCase();
}

function scoreJobMatch(profile, job) {
  const profileSkills = (profile.skills || []).map(normalizeSkill).filter(Boolean);
  const jobSkills = (job.requiredSkills || []).map(normalizeSkill).filter(Boolean);

  if (!jobSkills.length) {
    return {
      score: 65,
      reasons: ['No required skills listed, baseline compatibility score assigned.'],
      gaps: []
    };
  }

  const matchedSkills = jobSkills.filter((skill) => profileSkills.includes(skill));
  const missingSkills = jobSkills.filter((skill) => !profileSkills.includes(skill));
  const overlapRatio = matchedSkills.length / jobSkills.length;
  const score = Math.round(55 + overlapRatio * 45);

  return {
    score,
    reasons: [
      `${matchedSkills.length} of ${jobSkills.length} required skills matched.`,
      profile.headline ? `Profile headline relevance: ${profile.headline}` : 'Profile has baseline matching signals.'
    ],
    gaps: missingSkills
  };
}

async function getCandidateMatches(userId) {
  const profile = await getCandidateProfileByUserId(userId);
  if (!profile) {
    const error = new Error('Candidate profile not found.');
    error.statusCode = 404;
    error.code = 'PROFILE_NOT_FOUND';
    throw error;
  }

  const jobs = (await listJobs()).filter((job) => job.status === 'published');

  return jobs
    .map((job) => {
      const scored = scoreJobMatch(profile, job);
      return {
        job,
        score: scored.score,
        reasons: scored.reasons,
        gaps: scored.gaps
      };
    })
    .sort((a, b) => b.score - a.score);
}

async function createOrGetChatSession(userId) {
  if (!env.databaseUrl) {
    let session = memoryDb.chatSessions.find((item) => item.userId === Number(userId));
    if (!session) {
      session = {
        id: nextId('chatSessions'),
        userId: Number(userId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryDb.chatSessions.push(session);
    }

    return session;
  }

  let session = await prisma.chatSession.findFirst({
    where: { userId: Number(userId) },
    orderBy: { createdAt: 'desc' }
  });

  if (!session) {
    session = await prisma.chatSession.create({
      data: {
        userId: Number(userId)
      }
    });
  }

  return session;
}

function createAssistantReply(text) {
  const normalized = String(text || '').toLowerCase();

  if (normalized.includes('cv') || normalized.includes('resume')) {
    return 'Focus on measurable outcomes in your CV: metrics, technologies used, and clear project impact.';
  }
  if (normalized.includes('interview')) {
    return 'Use the STAR method and practice concise answers: situation, task, action, and result.';
  }
  if (normalized.includes('match')) {
    return 'To improve your match score, add missing job skills and align your profile headline with your target role.';
  }

  return 'I can help with CV optimization, interview preparation, and improving your job match quality.';
}

async function sendChatMessage(userId, content) {
  if (!env.databaseUrl) {
    const session = await createOrGetChatSession(userId);
    const now = new Date().toISOString();

    const userMessage = {
      id: nextId('chatMessages'),
      sessionId: session.id,
      sender: 'user',
      content,
      createdAt: now
    };

    const assistantMessage = {
      id: nextId('chatMessages'),
      sessionId: session.id,
      sender: 'assistant',
      content: createAssistantReply(content),
      createdAt: new Date().toISOString()
    };

    memoryDb.chatMessages.push(userMessage, assistantMessage);
    session.updatedAt = assistantMessage.createdAt;

    return {
      session,
      messages: [userMessage, assistantMessage]
    };
  }

  const session = await createOrGetChatSession(userId);

  const userMessage = await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      sender: 'user',
      content
    }
  });

  const assistantMessage = await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      sender: 'assistant',
      content: createAssistantReply(content)
    }
  });

  return {
    session,
    messages: [userMessage, assistantMessage]
  };
}

async function createInterviewSession(userId, payload) {
  if (!env.databaseUrl) {
    const now = new Date().toISOString();
    const session = {
      id: nextId('interviewSessions'),
      userId: Number(userId),
      roleTarget: payload.roleTarget || 'Software Engineer',
      levelTarget: payload.levelTarget || 'Junior',
      createdAt: now,
      updatedAt: now,
      questions: [
        'Tell me about yourself and why this role fits your goals.',
        'Describe a project where you solved a difficult problem.',
        'How do you handle feedback when working in a team?',
        'What skills are you currently improving and why?',
        'Why should we hire you for this position?'
      ],
      answers: [],
      feedback: null
    };

    memoryDb.interviewSessions.push(session);
    return session;
  }

  return prisma.interviewSession.create({
    data: {
      userId: Number(userId),
      roleTarget: payload.roleTarget || 'Software Engineer',
      levelTarget: payload.levelTarget || 'Junior',
      questions: [
        'Tell me about yourself and why this role fits your goals.',
        'Describe a project where you solved a difficult problem.',
        'How do you handle feedback when working in a team?',
        'What skills are you currently improving and why?',
        'Why should we hire you for this position?'
      ],
      answers: [],
      feedback: null
    }
  });
}

async function submitInterviewAnswer(userId, sessionId, payload) {
  if (!env.databaseUrl) {
    const session = memoryDb.interviewSessions.find(
      (item) => item.id === Number(sessionId) && item.userId === Number(userId)
    );

    if (!session) {
      const error = new Error('Interview session not found.');
      error.statusCode = 404;
      error.code = 'INTERVIEW_SESSION_NOT_FOUND';
      throw error;
    }

    const answer = {
      questionIndex: Number(payload.questionIndex),
      answer: payload.answer || ''
    };

    session.answers = session.answers.filter((item) => item.questionIndex !== answer.questionIndex);
    session.answers.push(answer);
    session.updatedAt = new Date().toISOString();

    return session;
  }

  const session = await prisma.interviewSession.findFirst({
    where: {
      id: Number(sessionId),
      userId: Number(userId)
    }
  });

  if (!session) {
    const error = new Error('Interview session not found.');
    error.statusCode = 404;
    error.code = 'INTERVIEW_SESSION_NOT_FOUND';
    throw error;
  }

  const answer = {
    questionIndex: Number(payload.questionIndex),
    answer: payload.answer || ''
  };

  const answers = Array.isArray(session.answers) ? session.answers : [];
  const nextAnswers = answers.filter((item) => item.questionIndex !== answer.questionIndex);
  nextAnswers.push(answer);

  return prisma.interviewSession.update({
    where: { id: Number(sessionId) },
    data: {
      answers: nextAnswers
    }
  });
}

async function generateInterviewFeedback(userId, sessionId) {
  if (!env.databaseUrl) {
    const session = memoryDb.interviewSessions.find(
      (item) => item.id === Number(sessionId) && item.userId === Number(userId)
    );

    if (!session) {
      const error = new Error('Interview session not found.');
      error.statusCode = 404;
      error.code = 'INTERVIEW_SESSION_NOT_FOUND';
      throw error;
    }

    const answered = session.answers.length;
    const completeness = session.questions.length ? answered / session.questions.length : 0;
    const score = Math.round(50 + completeness * 50);

    session.feedback = {
      score,
      summary:
        score >= 80
          ? 'Strong interview readiness. Keep refining examples with measurable outcomes.'
          : 'Good baseline. Add more concrete examples and structure answers with STAR.',
      strengths: ['Motivation clarity', 'Progressive learning mindset'],
      improvements: ['Use specific metrics in project examples', 'Keep answers concise and structured']
    };
    session.updatedAt = new Date().toISOString();

    return session.feedback;
  }

  const session = await prisma.interviewSession.findFirst({
    where: {
      id: Number(sessionId),
      userId: Number(userId)
    }
  });

  if (!session) {
    const error = new Error('Interview session not found.');
    error.statusCode = 404;
    error.code = 'INTERVIEW_SESSION_NOT_FOUND';
    throw error;
  }

  const answers = Array.isArray(session.answers) ? session.answers : [];
  const questions = Array.isArray(session.questions) ? session.questions : [];
  const answered = answers.length;
  const completeness = questions.length ? answered / questions.length : 0;
  const score = Math.round(50 + completeness * 50);

  const feedback = {
    score,
    summary:
      score >= 80
        ? 'Strong interview readiness. Keep refining examples with measurable outcomes.'
        : 'Good baseline. Add more concrete examples and structure answers with STAR.',
    strengths: ['Motivation clarity', 'Progressive learning mindset'],
    improvements: ['Use specific metrics in project examples', 'Keep answers concise and structured']
  };

  await prisma.interviewSession.update({
    where: { id: Number(sessionId) },
    data: { feedback }
  });

  return feedback;
}

module.exports = {
  getCandidateMatches,
  sendChatMessage,
  createInterviewSession,
  submitInterviewAnswer,
  generateInterviewFeedback
};
