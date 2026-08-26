const prisma = require('../config/prisma');
const AppError = require('../utils/appError');

const calculateAverage = (ratings) => {
  if (ratings.length === 0) {
    return null;
  }

  return ratings.reduce((total, rating) => total + rating.value, 0) / ratings.length;
};

const getDashboard = async (ownerId) => {
  const store = await prisma.store.findUnique({
    where: { ownerId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ratings: {
        select: {
          value: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              address: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
  });

  if (!store) {
    throw new AppError(404, 'No store is assigned to this owner.');
  }

  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    averageRating: calculateAverage(store.ratings),
    ratings: store.ratings.map(({ user, value }) => ({ user, rating: value })),
  };
};

module.exports = { getDashboard };
