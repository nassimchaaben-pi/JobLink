const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/prisma');
const { memoryDb, nextId } = require('../data/memory-db');

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

async function registerUser({ email, password, role }) {
  if (!env.databaseUrl) {
    const existingUser = memoryDb.users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      const error = new Error('Email is already in use.');
      error.statusCode = 409;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: nextId('users'),
      email: email.toLowerCase(),
      passwordHash,
      role,
      createdAt: new Date().toISOString()
    };

    memoryDb.users.push(user);

    if (role === 'candidate') {
      memoryDb.candidateProfiles.push({
        id: nextId('candidateProfiles'),
        userId: user.id,
        fullName: '',
        headline: '',
        location: '',
        bio: '',
        skills: [],
        updatedAt: new Date().toISOString()
      });
    }

    return sanitizeUser(user);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    const error = new Error('Email is already in use.');
    error.statusCode = 409;
    error.code = 'EMAIL_ALREADY_EXISTS';
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      role,
      ...(role === 'candidate'
        ? {
            candidateProfile: {
              create: {
                fullName: '',
                headline: '',
                location: '',
                bio: '',
                skills: []
              }
            }
          }
        : {})
    }
  });

  return sanitizeUser(user);
}

async function loginUser({ email, password }) {
  if (!env.databaseUrl) {
    const user = memoryDb.users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      const error = new Error('Invalid credentials.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      const error = new Error('Invalid credentials.');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    });

    return {
      token,
      user: sanitizeUser(user)
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    const error = new Error('Invalid credentials.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

  return {
    token,
    user: sanitizeUser(user)
  };
}

async function getUserById(userId) {
  if (!env.databaseUrl) {
    const user = memoryDb.users.find((item) => item.id === Number(userId));
    if (!user) {
      return null;
    }

    return sanitizeUser(user);
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) }
  });
  if (!user) {
    return null;
  }

  return sanitizeUser(user);
}

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
