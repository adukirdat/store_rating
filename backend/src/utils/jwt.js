const jwt = require('jsonwebtoken');
const AppError = require('./appError');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(500, 'Authentication is not configured.');
  }

  return process.env.JWT_SECRET;
};

const createToken = ({ id, role }) => jwt.sign(
  { userId: id, role },
  getJwtSecret(),
  { expiresIn: '1d' },
);

const verifyToken = (token) => jwt.verify(token, getJwtSecret());

module.exports = { createToken, verifyToken };
