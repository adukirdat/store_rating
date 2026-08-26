const { body, param, query } = require('express-validator');

const storeSortFields = ['name', 'address'];

const listStoresValidator = [
  query('search').optional().trim().isLength({ max: 400 }).withMessage('search must not exceed 400 characters.'),
  query('sortBy').optional().isIn(storeSortFields).withMessage(`sortBy must be one of: ${storeSortFields.join(', ')}.`),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be asc or desc.'),
];

const rateStoreValidator = [
  param('storeId').isUUID().withMessage('storeId must be a valid UUID.'),
  body('value').custom((value) => {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error('value must be an integer from 1 through 5.');
    }

    return true;
  }),
];

module.exports = { listStoresValidator, rateStoreValidator };
