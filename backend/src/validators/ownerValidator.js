const { query } = require('express-validator');

const ownerRatingSortFields = ['name', 'email', 'rating'];

const ownerDashboardValidator = [
  query('sortBy').optional().isIn(ownerRatingSortFields).withMessage(`sortBy must be one of: ${ownerRatingSortFields.join(', ')}.`),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be asc or desc.'),
];

module.exports = { ownerDashboardValidator };
