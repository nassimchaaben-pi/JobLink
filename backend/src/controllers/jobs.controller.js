const jobsService = require('../services/jobs.service');

async function listJobs(req, res) {
  const jobs = await jobsService.listJobs();
  const status = req.query.status;
  const q = String(req.query.q || '').trim().toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    const statusOk = status ? job.status === status : true;
    if (!statusOk) {
      return false;
    }

    if (!q) {
      return true;
    }

    const searchable = [job.title, job.company, job.location, job.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchable.includes(q);
  });

  return res.status(200).json({ jobs: filteredJobs });
}

async function getJob(req, res) {
  const job = await jobsService.getJobById(req.params.id);
  if (!job) {
    return res.status(404).json({ code: 'JOB_NOT_FOUND', message: 'Job not found.' });
  }

  return res.status(200).json({ job });
}

async function createRecruiterJob(req, res) {
  const { title, company } = req.body;
  if (!title || !company) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Title and company are required.' });
  }

  const job = await jobsService.createJob(req.user.sub, req.body);
  return res.status(201).json({ job });
}

async function listRecruiterJobs(req, res) {
  const jobs = await jobsService.listRecruiterJobs(req.user.sub);
  return res.status(200).json({ jobs });
}

async function updateRecruiterJob(req, res) {
  const job = await jobsService.updateJob(req.params.id, req.user.sub, req.body || {});
  if (!job) {
    return res.status(404).json({ code: 'JOB_NOT_FOUND', message: 'Job not found for this recruiter.' });
  }

  return res.status(200).json({ job });
}

module.exports = {
  listJobs,
  getJob,
  createRecruiterJob,
  listRecruiterJobs,
  updateRecruiterJob
};
