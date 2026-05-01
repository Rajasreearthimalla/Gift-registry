const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { formatUser } = require('./authController');

const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: formatUser(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, bio, password } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (email && email.toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409);
      throw new Error('Another account already uses this email');
    }
    user.email = email.toLowerCase();
  }

  if (typeof name === 'string' && name.trim()) {
    user.name = name.trim();
  }

  if (typeof bio === 'string') {
    user.bio = bio;
  }

  if (password) {
    user.password = password;
  }

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: formatUser(user)
  });
});

module.exports = {
  getProfile,
  updateProfile
};

