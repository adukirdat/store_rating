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
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({ origin: clientUrl }));
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

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Store Rating API listening on port ${port}`);
});
