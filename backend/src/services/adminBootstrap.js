const bcrypt = require('bcryptjs');
const { ROLES } = require('../utils/roles');

const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const BOOTSTRAP_ADMIN_NAME = 'Production Administrator';
const BOOTSTRAP_ADMIN_ADDRESS = 'Production bootstrap account';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class BootstrapConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BootstrapConfigurationError';
  }
}

const getBootstrapConfiguration = (environment = process.env) => {
  if (environment.NODE_ENV !== 'production') return null;

  const email = (environment.ADMIN_BOOTSTRAP_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const password = environment.ADMIN_BOOTSTRAP_PASSWORD;

  if (!password) throw new BootstrapConfigurationError('ADMIN_BOOTSTRAP_PASSWORD must be configured before starting the production API.');
  if (!emailPattern.test(email)) throw new BootstrapConfigurationError('ADMIN_BOOTSTRAP_EMAIL must be a valid email address.');
  if (password.length < 8 || password.length > 16 || !/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) throw new BootstrapConfigurationError('ADMIN_BOOTSTRAP_PASSWORD must meet the application password requirements.');

  return { email, password };
};

const ensureProductionAdmin = async ({ environment = process.env, prismaClient, bcryptClient = bcrypt } = {}) => {
  const configuration = getBootstrapConfiguration(environment);
  if (!configuration) return { skipped: true, created: false };

  const activePrisma = prismaClient || require('../config/prisma');

  const existingUser = await activePrisma.user.findUnique({ where: { email: configuration.email } });
  if (existingUser) {
    if (existingUser.role !== ROLES.ADMIN) throw new BootstrapConfigurationError('ADMIN_BOOTSTRAP_EMAIL is already assigned to a non-admin account.');
    return { skipped: false, created: false };
  }

  const passwordHash = await bcryptClient.hash(configuration.password, 10);
  try {
    await activePrisma.user.create({
      data: {
        name: BOOTSTRAP_ADMIN_NAME,
        email: configuration.email,
        address: BOOTSTRAP_ADMIN_ADDRESS,
        password: passwordHash,
        role: ROLES.ADMIN,
      },
    });
    return { skipped: false, created: true };
  } catch (error) {
    if (error.code !== 'P2002') throw error;
    const concurrentlyCreatedUser = await activePrisma.user.findUnique({ where: { email: configuration.email } });
    if (!concurrentlyCreatedUser || concurrentlyCreatedUser.role !== ROLES.ADMIN) throw new BootstrapConfigurationError('ADMIN_BOOTSTRAP_EMAIL could not be safely reserved for the production admin account.');
    return { skipped: false, created: false };
  }
};

module.exports = { BootstrapConfigurationError, ensureProductionAdmin, getBootstrapConfiguration };
