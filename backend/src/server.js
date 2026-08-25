require('dotenv').config();

const cors = require('cors');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);

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
