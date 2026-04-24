const prisma = require('../config/prisma');
const env = require('../config/env');
const { memoryDb } = require('../data/memory-db');

async function getCandidateProfileByUserId(userId) {
  if (!env.databaseUrl) {
    return memoryDb.candidateProfiles.find((item) => item.userId === Number(userId)) || null;
  }

  return prisma.candidateProfile.findUnique({
    where: { userId: Number(userId) }
  });
}

async function updateCandidateProfile(userId, payload) {
  if (!env.databaseUrl) {
    const profile = memoryDb.candidateProfiles.find((item) => item.userId === Number(userId));
    if (!profile) {
      return null;
    }

    profile.fullName = payload.fullName ?? profile.fullName;
    profile.headline = payload.headline ?? profile.headline;
    profile.location = payload.location ?? profile.location;
    profile.bio = payload.bio ?? profile.bio;
    profile.skills = Array.isArray(payload.skills) ? payload.skills : profile.skills;
    profile.updatedAt = new Date().toISOString();

    return profile;
  }

  const profile = await getCandidateProfileByUserId(userId);
  if (!profile) {
    return null;
  }

  return prisma.candidateProfile.update({
    where: { userId: Number(userId) },
    data: {
      fullName: payload.fullName ?? profile.fullName,
      headline: payload.headline ?? profile.headline,
      location: payload.location ?? profile.location,
      bio: payload.bio ?? profile.bio,
      skills: Array.isArray(payload.skills) ? payload.skills : profile.skills
    }
  });
}

module.exports = {
  getCandidateProfileByUserId,
  updateCandidateProfile
};
