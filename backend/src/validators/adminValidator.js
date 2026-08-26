const { body, param, query } = require('express-validator');
const { passwordRules } = require('./authValidator');
const { ROLE_VALUES } = require('../utils/roles');

const userSortFields = ['name', 'email', 'address', 'role'];
const storeSortFields = ['name', 'email', 'address'];

const createUserValidator = [
  body('name').trim().isLength({ min: 20, max: 60 }).withMessage('name must be 20 to 60 characters long.'),
  body('email').trim().isEmail().withMessage('email must be a valid email address.').normalizeEmail(),
  body('address').trim().notEmpty().withMessage('address is required.').isLength({ max: 400 }).withMessage('address must not exceed 400 characters.'),
  ...passwordRules('password'),
  body('role').isIn(ROLE_VALUES).withMessage(`role must be one of: ${ROLE_VALUES.join(', ')}.`),
];

const listUsersValidator = [
  query('search').optional().trim().isLength({ max: 400 }).withMessage('search must not exceed 400 characters.'),
  query('role').optional().isIn(ROLE_VALUES).withMessage('role is invalid.'),
  query('sortBy').optional().isIn(userSortFields).withMessage(`sortBy must be one of: ${userSortFields.join(', ')}.`),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be asc or desc.'),
];

const userIdValidator = [
  param('userId').isUUID().withMessage('userId must be a valid UUID.'),
];

const createStoreValidator = [
  body('name').trim().notEmpty().withMessage('name is required.').isLength({ min: 20, max: 60 }).withMessage('name must be 20 to 60 characters long.'),
  body('email').trim().isEmail().withMessage('email must be a valid email address.').normalizeEmail(),
  body('address').trim().notEmpty().withMessage('address is required.').isLength({ max: 400 }).withMessage('address must not exceed 400 characters.'),
  body('ownerId').isUUID().withMessage('ownerId must be a valid UUID.'),
];

const listStoresValidator = [
  query('search').optional().trim().isLength({ max: 400 }).withMessage('search must not exceed 400 characters.'),
  query('sortBy').optional().isIn(storeSortFields).withMessage(`sortBy must be one of: ${storeSortFields.join(', ')}.`),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be asc or desc.'),
];

module.exports = {
  createStoreValidator,
  createUserValidator,
  listStoresValidator,
  listUsersValidator,
  userIdValidator,
};
