const { rateLimit } = require('express-rate-limit');
const { writeLog } = require('../utils/logger');

const createAuthRateLimiter = (limit) => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (request, response, _next, options) => {
    writeLog('warn', 'rate_limit_exceeded', {
      method: request.method,
      path: `${request.baseUrl}${request.path}`,
      status: 429,
    });
    response.status(429).json(options.message);
  },
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
    errors: [],
  },
});

const loginRateLimiter = createAuthRateLimiter(10);
const signupRateLimiter = createAuthRateLimiter(5);
const passwordUpdateRateLimiter = createAuthRateLimiter(5);

module.exports = { loginRateLimiter, passwordUpdateRateLimiter, signupRateLimiter };
