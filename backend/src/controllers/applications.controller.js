const applicationsService = require('../services/applications.service');

async function applyToJob(req, res, next) {
  try {
    const application = await applicationsService.createApplication(req.user.sub, req.params.id);
    return res.status(201).json({ application });
  } catch (error) {
    return next(error);
  }
}

async function listMyApplications(req, res) {
  const applications = await applicationsService.listCandidateApplications(req.user.sub);
  return res.status(200).json({ applications });
}

async function listJobApplications(req, res) {
  const applications = await applicationsService.listJobApplicationsForRecruiter(req.params.id, req.user.sub);
  if (!applications) {
    return res.status(404).json({ code: 'JOB_NOT_FOUND', message: 'Job not found for this recruiter.' });
  }

  return res.status(200).json({ applications });
}

async function updateApplicationStatus(req, res, next) {
  try {
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Status is required.' });
    }

    const application = await applicationsService.updateApplicationStatus(req.params.id, req.user.sub, status, note);
    return res.status(200).json({ application });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  applyToJob,
  listMyApplications,
  listJobApplications,
  updateApplicationStatus
};
