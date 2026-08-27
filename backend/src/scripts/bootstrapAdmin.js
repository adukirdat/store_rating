require('dotenv').config();

const prisma = require('../config/prisma');
const { BootstrapConfigurationError, ensureProductionAdmin } = require('../services/adminBootstrap');

const run = async () => {
  try {
    const result = await ensureProductionAdmin();
    if (result.created) console.log('Production admin bootstrap completed.');
    else if (!result.skipped) console.log('Production admin bootstrap verified.');
  } catch (error) {
    if (error instanceof BootstrapConfigurationError) console.error(error.message);
    else console.error('Production admin bootstrap failed. Check configuration and database connectivity.');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

run();
