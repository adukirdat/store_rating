const { body } = require('express-validator');

const passwordRules = (field) => [
  body(field)
    .isString().withMessage(`${field} must be a string.`)
    .isLength({ min: 8, max: 16 }).withMessage(`${field} must be 8 to 16 characters long.`)
    .matches(/[A-Z]/).withMessage(`${field} must contain at least one uppercase letter.`)
    .matches(/[^A-Za-z0-9]/).withMessage(`${field} must contain at least one special character.`),
];

const signupValidator = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 }).withMessage('name must be 20 to 60 characters long.'),
  body('email')
    .trim()
    .isEmail().withMessage('email must be a valid email address.')
    .normalizeEmail(),
  body('address')
    .trim()
    .notEmpty().withMessage('address is required.')
    .isLength({ max: 400 }).withMessage('address must not exceed 400 characters.'),
  ...passwordRules('password'),
];

const loginValidator = [
  body('email')
    .trim()
    .isEmail().withMessage('email must be a valid email address.')
    .normalizeEmail(),
  body('password').isString().notEmpty().withMessage('password is required.'),
];

const updatePasswordValidator = [
  body('currentPassword').isString().notEmpty().withMessage('currentPassword is required.'),
  ...passwordRules('newPassword'),
];

module.exports = { loginValidator, signupValidator, updatePasswordValidator };
