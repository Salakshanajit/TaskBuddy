const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const { validateRegister, validateLogin } = require('../utils/validators');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { errors, data } = validateRegister(req.body);
  if (errors.length) throw new ApiError(400, errors[0], errors);

  const existing = await User.findOne({ email: data.email });
  if (existing) throw new ApiError(409, 'An account with this email already exists.');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const user = await User.create({ name: data.name, email: data.email, password: hashedPassword });

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    token: generateToken(user._id),
    user, // password is stripped by the schema's toJSON transform
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { errors, data } = validateLogin(req.body);
  if (errors.length) throw new ApiError(400, errors[0], errors);

  const user = await User.findOne({ email: data.email }).select('+password');
  const passwordMatches = user && (await bcrypt.compare(data.password, user.password));

  // Same message for "no such user" and "wrong password" so attackers cannot discover registered emails.
  if (!passwordMatches) throw new ApiError(401, 'Invalid email or password.');

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    token: generateToken(user._id),
    user,
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

module.exports = { register, login, getMe };
