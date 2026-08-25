require('dotenv').config();

const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

const demoPassword = 'DemoPassword@1';

async function seed() {
  const password = await bcrypt.hash(demoPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Administrator Demo Account',
      address: '100 Admin Avenue, Pune, Maharashtra',
      password,
      role: 'ADMIN',
    },
    create: {
      name: 'Administrator Demo Account',
      email: 'admin@example.com',
      address: '100 Admin Avenue, Pune, Maharashtra',
      password,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      name: 'Normal User Demo Account',
      address: '200 User Street, Pune, Maharashtra',
      password,
      role: 'NORMAL_USER',
    },
    create: {
      name: 'Normal User Demo Account',
      email: 'user@example.com',
      address: '200 User Street, Pune, Maharashtra',
      password,
      role: 'NORMAL_USER',
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {
      name: 'Store Owner Demo Account',
      address: '300 Owner Road, Pune, Maharashtra',
      password,
      role: 'STORE_OWNER',
    },
    create: {
      name: 'Store Owner Demo Account',
      email: 'owner@example.com',
      address: '300 Owner Road, Pune, Maharashtra',
      password,
      role: 'STORE_OWNER',
    },
  });

  const store = await prisma.store.upsert({
    where: { email: 'store@example.com' },
    update: {
      name: 'Store Rating Demo Marketplace',
      address: '400 Market Lane, Pune, Maharashtra',
      ownerId: owner.id,
    },
    create: {
      name: 'Store Rating Demo Marketplace',
      email: 'store@example.com',
      address: '400 Market Lane, Pune, Maharashtra',
      ownerId: owner.id,
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: {
        userId: user.id,
        storeId: store.id,
      },
    },
    update: { value: 4 },
    create: {
      value: 4,
      userId: user.id,
      storeId: store.id,
    },
  });

  console.log(`Seeded demo data for ${admin.email}, ${user.email}, and ${owner.email}.`);
}

seed()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
