const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  loginRateLimiter,
  passwordUpdateRateLimiter,
  signupRateLimiter,
} = require('../middleware/authRateLimiters');
const {
  loginValidator,
  signupValidator,
  updatePasswordValidator,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', signupRateLimiter, signupValidator, validateRequest, authController.signup);
router.post('/login', loginRateLimiter, loginValidator, validateRequest, authController.login);
router.patch(
  '/update-password',
  passwordUpdateRateLimiter,
  authenticate,
  updatePasswordValidator,
  validateRequest,
  authController.updatePassword,
);

module.exports = router;
