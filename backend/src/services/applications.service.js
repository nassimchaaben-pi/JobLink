const prisma = require('../config/prisma');
const env = require('../config/env');
const { memoryDb, nextId } = require('../data/memory-db');
const { getJobById } = require('./jobs.service');

const ALLOWED_STATUSES = ['applied', 'screening', 'interview', 'offer', 'rejected'];

async function createApplication(candidateUserId, jobId) {
  if (!env.databaseUrl) {
    const job = await getJobById(jobId);
    if (!job) {
      const error = new Error('Job not found.');
      error.statusCode = 404;
      error.code = 'JOB_NOT_FOUND';
      throw error;
    }

    const existing = memoryDb.applications.find(
      (item) => item.jobId === Number(jobId) && item.candidateUserId === Number(candidateUserId)
    );

    if (existing) {
      const error = new Error('Application already exists for this job.');
      error.statusCode = 409;
      error.code = 'APPLICATION_EXISTS';
      throw error;
    }

    const now = new Date().toISOString();
    const application = {
      id: nextId('applications'),
      jobId: Number(jobId),
      candidateUserId: Number(candidateUserId),
      status: 'applied',
      createdAt: now,
      updatedAt: now,
      history: [{ at: now, status: 'applied', note: 'Application submitted.' }]
    };

    memoryDb.applications.push(application);
    return application;
  }

  const job = await getJobById(jobId);
  if (!job) {
    const error = new Error('Job not found.');
    error.statusCode = 404;
    error.code = 'JOB_NOT_FOUND';
    throw error;
  }

  const existing = await prisma.application.findUnique({
    where: {
      jobId_candidateUserId: {
        jobId: Number(jobId),
        candidateUserId: Number(candidateUserId)
      }
    }
  });

  if (existing) {
    const error = new Error('Application already exists for this job.');
    error.statusCode = 409;
    error.code = 'APPLICATION_EXISTS';
    throw error;
  }

  const now = new Date().toISOString();
  return prisma.application.create({
    data: {
      jobId: Number(jobId),
      candidateUserId: Number(candidateUserId),
      status: 'applied',
      history: [{ at: now, status: 'applied', note: 'Application submitted.' }]
    }
  });
}

async function listCandidateApplications(candidateUserId) {
  if (!env.databaseUrl) {
    return memoryDb.applications
      .filter((item) => item.candidateUserId === Number(candidateUserId))
      .map((application) => ({
        ...application,
        job: memoryDb.jobs.find((job) => job.id === application.jobId) || null
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return prisma.application.findMany({
    where: { candidateUserId: Number(candidateUserId) },
    include: { job: true },
    orderBy: { createdAt: 'desc' }
  });
}

async function listJobApplicationsForRecruiter(jobId, recruiterId) {
  if (!env.databaseUrl) {
    const job = await getJobById(jobId);
    if (!job || job.recruiterId !== Number(recruiterId)) {
      return null;
    }

    return memoryDb.applications
      .filter((item) => item.jobId === Number(jobId))
      .map((application) => ({
        ...application,
        candidate: memoryDb.users.find((user) => user.id === application.candidateUserId) || null
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const job = await getJobById(jobId);
  if (!job || job.recruiterId !== Number(recruiterId)) {
    return null;
  }

  return prisma.application.findMany({
    where: { jobId: Number(jobId) },
    include: {
      candidate: {
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

async function updateApplicationStatus(applicationId, recruiterId, status, note) {
  if (!ALLOWED_STATUSES.includes(status)) {
    const error = new Error('Invalid application status.');
    error.statusCode = 400;
    error.code = 'INVALID_STATUS';
    throw error;
  }

  if (!env.databaseUrl) {
    const application = memoryDb.applications.find((item) => item.id === Number(applicationId));
    if (!application) {
      const error = new Error('Application not found.');
      error.statusCode = 404;
      error.code = 'APPLICATION_NOT_FOUND';
      throw error;
    }

    const job = await getJobById(application.jobId);
    if (!job || job.recruiterId !== Number(recruiterId)) {
      const error = new Error('You are not allowed to update this application.');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    application.status = status;
    application.updatedAt = new Date().toISOString();
    application.history = Array.isArray(application.history) ? application.history : [];
    application.history.push({ at: application.updatedAt, status, note: note || '' });

    return application;
  }

  const application = await prisma.application.findUnique({
    where: { id: Number(applicationId) }
  });
  if (!application) {
    const error = new Error('Application not found.');
    error.statusCode = 404;
    error.code = 'APPLICATION_NOT_FOUND';
    throw error;
  }

  const job = await getJobById(application.jobId);
  if (!job || job.recruiterId !== Number(recruiterId)) {
    const error = new Error('You are not allowed to update this application.');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  const history = Array.isArray(application.history) ? application.history : [];
  history.push({ at: new Date().toISOString(), status, note: note || '' });

  return prisma.application.update({
    where: { id: Number(applicationId) },
    data: {
      status,
      history
    }
  });
}

module.exports = {
  createApplication,
  listCandidateApplications,
  listJobApplicationsForRecruiter,
  updateApplicationStatus,
  ALLOWED_STATUSES
};
