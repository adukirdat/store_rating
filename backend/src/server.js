require('dotenv').config();

const requireEnvironmentVariable = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} must be configured before starting the API.`);
  }

  return value;
};

const environment = process.env.NODE_ENV || 'development';
requireEnvironmentVariable('DATABASE_URL');
requireEnvironmentVariable('JWT_SECRET');

const clientUrl = process.env.CLIENT_URL?.trim()
  || (environment === 'production' ? requireEnvironmentVariable('CLIENT_URL') : 'http://localhost:5173');

try {
  new URL(clientUrl);
} catch {
  throw new Error('CLIENT_URL must be a valid URL.');
}

const configuredPort = process.env.PORT?.trim();
const port = configuredPort ? Number(configuredPort) : 5000;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const { requestLogger, writeLog } = require('./utils/logger');
const prisma = require('./config/prisma');

const app = express();

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: clientUrl }));
app.use(requestLogger);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owner', ownerRoutes);

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'Store Rating API is running',
    data: {},
  });
});

app.get('/api/ready', async (request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.status(200).json({
      success: true,
      message: 'Store Rating API is ready',
      data: {},
    });
  } catch (error) {
    writeLog('error', 'readiness_check_failed', {
      method: request.method,
      path: request.path,
      errorType: error.name || 'Error',
    });
    response.status(503).json({
      success: false,
      message: 'Store Rating API is not ready.',
      errors: [],
    });
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Store Rating API listening on port ${port}`);
});

let isShuttingDown = false;

const shutdown = (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  writeLog('info', 'shutdown_started', { signal });

  const forceExitTimer = setTimeout(() => {
    writeLog('error', 'shutdown_timeout');
    process.exit(1);
  }, 30_000);
  forceExitTimer.unref();

  server.close(async (serverError) => {
    try {
      if (serverError) {
        throw serverError;
      }

      await prisma.$disconnect();
      clearTimeout(forceExitTimer);
      writeLog('info', 'shutdown_complete');
      process.exit(0);
    } catch (error) {
      clearTimeout(forceExitTimer);
      writeLog('error', 'shutdown_failed', { errorType: error.name || 'Error' });
      process.exit(1);
    }
  });
};

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));
