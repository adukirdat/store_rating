const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  loginValidator,
  signupValidator,
  updatePasswordValidator,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', signupValidator, validateRequest, authController.signup);
router.post('/login', loginValidator, validateRequest, authController.login);
router.patch(
  '/update-password',
  authenticate,
  updatePasswordValidator,
  validateRequest,
  authController.updatePassword,
);

module.exports = router;
