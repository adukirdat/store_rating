const { rateLimit } = require('express-rate-limit');

const createAuthRateLimiter = (limit) => rateLimit({
  windowMs: 15 * 60 * 1000,
  limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
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
