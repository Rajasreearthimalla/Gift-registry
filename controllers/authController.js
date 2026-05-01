const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  createdAt: user.createdAt
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(409);
    throw new Error('A user with this email already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password
  });

  res.status(201).json({
    message: 'Registration successful',
    token: generateToken(user._id),
    user: formatUser(user)
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    message: 'Login successful',
    token: generateToken(user._id),
    user: formatUser(user)
  });
});

module.exports = {
  registerUser,
  loginUser,
  formatUser
};

