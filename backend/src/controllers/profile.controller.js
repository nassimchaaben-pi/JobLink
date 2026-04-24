const { getCandidateProfileByUserId, updateCandidateProfile } = require('../services/profile.service');

async function getMyProfile(req, res) {
  const profile = await getCandidateProfileByUserId(req.user.sub);
  if (!profile) {
    return res.status(404).json({ code: 'PROFILE_NOT_FOUND', message: 'Candidate profile not found.' });
  }

  return res.status(200).json({ profile });
}

async function updateMyProfile(req, res) {
  const payload = req.body || {};

  if (payload.skills !== undefined && !Array.isArray(payload.skills)) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'skills must be an array.' });
  }

  if (payload.fullName !== undefined && String(payload.fullName).length > 120) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'fullName must be 120 characters or less.' });
  }

  if (payload.headline !== undefined && String(payload.headline).length > 120) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'headline must be 120 characters or less.' });
  }

  if (payload.bio !== undefined && String(payload.bio).length > 2000) {
    return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'bio must be 2000 characters or less.' });
  }

  const profile = await updateCandidateProfile(req.user.sub, payload);
  if (!profile) {
    return res.status(404).json({ code: 'PROFILE_NOT_FOUND', message: 'Candidate profile not found.' });
  }

  return res.status(200).json({ profile });
}

module.exports = {
  getMyProfile,
  updateMyProfile
};
