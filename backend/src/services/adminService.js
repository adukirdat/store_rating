const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const { ROLES } = require('../utils/roles');

const safeUser = ({ id, name, email, address, role }) => ({ id, name, email, address, role });

const calculateAverage = (ratings) => {
  if (ratings.length === 0) {
    return null;
  }

  return ratings.reduce((total, rating) => total + rating.value, 0) / ratings.length;
};

const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return { totalUsers, totalStores, totalRatings };
};

const createUser = async ({ name, email, address, password, role }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new AppError(409, 'An account with this email already exists.');
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      address,
      password: await bcrypt.hash(password, 10),
      role,
    },
  });

  return safeUser(user);
};

const listUsers = async ({ search, role, sortBy = 'name', order = 'asc' }) => {
  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(search
        ? {
          OR: ['name', 'email', 'address'].map((field) => ({
            [field]: { contains: search, mode: 'insensitive' },
          })),
        }
        : {}),
    },
    orderBy: { [sortBy]: order },
    select: { id: true, name: true, email: true, address: true, role: true },
  });

  return users;
};

const getUserDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      ownedStore: {
        select: {
          id: true,
          name: true,
          ratings: { select: { value: true } },
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, 'User was not found.');
  }

  const { ownedStore, ...safeDetails } = user;

  if (user.role !== ROLES.STORE_OWNER || !ownedStore) {
    return safeDetails;
  }

  return {
    ...safeDetails,
    store: {
      id: ownedStore.id,
      name: ownedStore.name,
      averageRating: calculateAverage(ownedStore.ratings),
    },
  };
};

const createStore = async ({ name, email, address, ownerId }) => {
  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { id: true, role: true, ownedStore: { select: { id: true } } },
  });

  if (!owner) {
    throw new AppError(404, 'Store owner was not found.');
  }

  if (owner.role !== ROLES.STORE_OWNER) {
    throw new AppError(400, 'Selected user is not a store owner.');
  }

  if (owner.ownedStore) {
    throw new AppError(409, 'Store owner is already assigned to a store.');
  }

  const existingStore = await prisma.store.findUnique({ where: { email } });

  if (existingStore) {
    throw new AppError(409, 'A store with this email already exists.');
  }

  return prisma.store.create({
    data: { name, email, address, ownerId },
    select: { id: true, name: true, email: true, address: true, ownerId: true },
  });
};

const listStores = async ({ search, sortBy = 'name', order = 'asc' }) => {
  const stores = await prisma.store.findMany({
    where: search
      ? {
        OR: ['name', 'email', 'address'].map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        })),
      }
      : {},
    orderBy: { [sortBy]: order },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ratings: { select: { value: true } },
    },
  });

  return stores.map(({ ratings, ...store }) => ({
    ...store,
    overallRating: calculateAverage(ratings),
  }));
};

module.exports = {
  createStore,
  createUser,
  getDashboardStats,
  getUserDetails,
  listStores,
  listUsers,
};
