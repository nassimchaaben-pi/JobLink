const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  listJobs,
  getJob,
  createRecruiterJob,
  listRecruiterJobs,
  updateRecruiterJob
} = require('../controllers/jobs.controller');
const {
  applyToJob,
  listMyApplications,
  listJobApplications,
  updateApplicationStatus
} = require('../controllers/applications.controller');

const router = express.Router();

router.get('/recruiter/mine', authenticate, authorize('recruiter'), listRecruiterJobs);
router.post('/recruiter', authenticate, authorize('recruiter'), createRecruiterJob);
router.put('/recruiter/:id', authenticate, authorize('recruiter'), updateRecruiterJob);
router.get('/recruiter/:id/applications', authenticate, authorize('recruiter'), listJobApplications);

router.get('/candidate/applications/me', authenticate, authorize('candidate'), listMyApplications);

router.patch('/applications/:id/status', authenticate, authorize('recruiter'), updateApplicationStatus);

router.get('/', listJobs);
router.get('/:id', getJob);
router.post('/:id/apply', authenticate, authorize('candidate'), applyToJob);

module.exports = router;
