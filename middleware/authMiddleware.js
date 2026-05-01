const jwt = require('jsonwebtoken');
const User = require('../models/User');

const resolveUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(decoded.userId).select('-password');
};

const protect = async (req, res, next) => {
  try {
    const user = await resolveUserFromToken(req);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const optionalProtect = async (req, res, next) => {
  try {
    req.user = await resolveUserFromToken(req);
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  protect,
  optionalProtect
};

