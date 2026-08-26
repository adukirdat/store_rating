const { validationResult } = require('express-validator');

const validateRequest = (request, _response, next) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 400;
    error.errors = errors.array().map(({ msg, path }) => ({ field: path, message: msg }));
    return next(error);
  }

  return next();
};

module.exports = validateRequest;
