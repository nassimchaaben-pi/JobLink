const authService = require('../services/auth.service');

const ALLOWED_ROLES = ['candidate', 'recruiter', 'admin'];

async function register(req, res, next) {
  try {
    const { email, password, role = 'candidate' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Email and password are required.' });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid role value.' });
    }

    const user = await authService.registerUser({ email, password, role });
    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Email and password are required.' });
    }

    const payload = await authService.loginUser({ email, password });
    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
}

async function me(req, res) {
  const user = await authService.getUserById(req.user.sub);
  if (!user) {
    return res.status(404).json({ code: 'NOT_FOUND', message: 'User not found.' });
  }

  return res.status(200).json({ user });
}

module.exports = {
  register,
  login,
  me
};
