const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const { createToken } = require('../utils/jwt');

const safeUser = ({ id, name, email, role }) => ({ id, name, email, role });

const signup = async ({ name, email, address, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      address,
      password: passwordHash,
      role: 'NORMAL_USER',
    },
  });

  return safeUser(user);
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatches) {
    throw new AppError(401, 'Invalid email or password.');
  }

  return {
    token: createToken(user),
    user: safeUser(user),
  };
};

const updatePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(404, 'User account was not found.');
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.password);

  if (!passwordMatches) {
    throw new AppError(401, 'Current password is incorrect.');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: passwordHash },
  });
};

module.exports = { login, signup, updatePassword };
