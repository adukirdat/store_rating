const prisma = require('../config/prisma');
const AppError = require('../utils/appError');

const listStores = async ({ userId, search, sortBy = 'name', order = 'asc' }) => {
  const stores = await prisma.store.findMany({
    where: search
      ? {
        OR: ['name', 'address'].map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        })),
      }
      : {},
    orderBy: { [sortBy]: order },
    select: { id: true, name: true, address: true },
  });

  const storeIds = stores.map((store) => store.id);
  const [overallRatings, submittedRatings] = await Promise.all([
    prisma.rating.groupBy({
      by: ['storeId'],
      where: { storeId: { in: storeIds } },
      _avg: { value: true },
    }),
    prisma.rating.findMany({
      where: { userId, storeId: { in: storeIds } },
      select: { storeId: true, value: true },
    }),
  ]);

  const overallRatingByStore = new Map(
    overallRatings.map(({ storeId, _avg }) => [storeId, _avg.value]),
  );
  const submittedRatingByStore = new Map(
    submittedRatings.map(({ storeId, value }) => [storeId, value]),
  );

  return stores.map((store) => ({
    ...store,
    overallRating: overallRatingByStore.get(store.id) ?? null,
    userSubmittedRating: submittedRatingByStore.get(store.id) ?? null,
  }));
};

const rateStore = async ({ userId, storeId, value }) => {
  const store = await prisma.store.findUnique({ where: { id: storeId }, select: { id: true } });

  if (!store) {
    throw new AppError(404, 'Store was not found.');
  }

  const existingRating = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
  });

  const rating = existingRating
    ? await prisma.rating.update({ where: { id: existingRating.id }, data: { value } })
    : await prisma.rating.create({ data: { userId, storeId, value } });

  return {
    created: !existingRating,
    rating: { id: rating.id, storeId: rating.storeId, value: rating.value, updatedAt: rating.updatedAt },
  };
};

module.exports = { listStores, rateStore };
