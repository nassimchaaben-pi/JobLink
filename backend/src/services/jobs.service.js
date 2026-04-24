const prisma = require('../config/prisma');
const env = require('../config/env');
const { memoryDb, nextId } = require('../data/memory-db');

async function listJobs() {
  if (!env.databaseUrl) {
    return [...memoryDb.jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return prisma.job.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

async function listRecruiterJobs(recruiterId) {
  if (!env.databaseUrl) {
    return memoryDb.jobs
      .filter((job) => job.recruiterId === Number(recruiterId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return prisma.job.findMany({
    where: { recruiterId: Number(recruiterId) },
    orderBy: { createdAt: 'desc' }
  });
}

async function getJobById(jobId) {
  if (!env.databaseUrl) {
    return memoryDb.jobs.find((job) => job.id === Number(jobId)) || null;
  }

  return prisma.job.findUnique({
    where: { id: Number(jobId) }
  });
}

async function createJob(recruiterId, payload) {
  if (!env.databaseUrl) {
    const now = new Date().toISOString();
    const job = {
      id: nextId('jobs'),
      recruiterId: Number(recruiterId),
      title: payload.title,
      company: payload.company,
      location: payload.location || '',
      employmentType: payload.employmentType || 'full-time',
      salaryRange: payload.salaryRange || '',
      description: payload.description || '',
      requiredSkills: Array.isArray(payload.requiredSkills) ? payload.requiredSkills : [],
      status: payload.status || 'draft',
      createdAt: now,
      updatedAt: now
    };

    memoryDb.jobs.push(job);
    return job;
  }

  return prisma.job.create({
    data: {
      recruiterId: Number(recruiterId),
      title: payload.title,
      company: payload.company,
      location: payload.location || '',
      employmentType: payload.employmentType || 'full-time',
      salaryRange: payload.salaryRange || '',
      description: payload.description || '',
      requiredSkills: Array.isArray(payload.requiredSkills) ? payload.requiredSkills : [],
      status: payload.status || 'draft'
    }
  });
}

async function updateJob(jobId, recruiterId, payload) {
  if (!env.databaseUrl) {
    const job = await getJobById(jobId);
    if (!job || job.recruiterId !== Number(recruiterId)) {
      return null;
    }

    job.title = payload.title ?? job.title;
    job.company = payload.company ?? job.company;
    job.location = payload.location ?? job.location;
    job.employmentType = payload.employmentType ?? job.employmentType;
    job.salaryRange = payload.salaryRange ?? job.salaryRange;
    job.description = payload.description ?? job.description;
    job.requiredSkills = Array.isArray(payload.requiredSkills) ? payload.requiredSkills : job.requiredSkills;
    job.status = payload.status ?? job.status;
    job.updatedAt = new Date().toISOString();

    return job;
  }

  const job = await getJobById(jobId);
  if (!job || job.recruiterId !== Number(recruiterId)) {
    return null;
  }

  return prisma.job.update({
    where: { id: Number(jobId) },
    data: {
      title: payload.title ?? job.title,
      company: payload.company ?? job.company,
      location: payload.location ?? job.location,
      employmentType: payload.employmentType ?? job.employmentType,
      salaryRange: payload.salaryRange ?? job.salaryRange,
      description: payload.description ?? job.description,
      requiredSkills: Array.isArray(payload.requiredSkills) ? payload.requiredSkills : job.requiredSkills,
      status: payload.status ?? job.status
    }
  });
}

module.exports = {
  listJobs,
  listRecruiterJobs,
  getJobById,
  createJob,
  updateJob
};
