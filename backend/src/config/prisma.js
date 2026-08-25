const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to initialize Prisma.');
}

const pool = new Pool({
  connectionString,
  allowExitOnIdle: true,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

module.exports = prisma;
