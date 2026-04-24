const { memoryDb } = require('../data/memory-db');

function listUsers(req, res) {
  const users = memoryDb.users.map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));

  return res.status(200).json({ users });
}

function dashboardMetrics(req, res) {
  const metrics = {
    usersCount: memoryDb.users.length,
    candidateProfilesCount: memoryDb.candidateProfiles.length,
    jobsCount: memoryDb.jobs.length,
    applicationsCount: memoryDb.applications.length,
    interviewSessionsCount: memoryDb.interviewSessions.length,
    chatMessagesCount: memoryDb.chatMessages.length
  };

  return res.status(200).json({ metrics });
}

module.exports = {
  listUsers,
  dashboardMetrics
};
