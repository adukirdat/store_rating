const { logError } = require('../utils/logger');

const notFoundHandler = (request, _response, next) => {
  const error = new Error(`Route ${request.method} ${request.originalUrl} was not found.`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;
  const isInvalidJson = error instanceof SyntaxError && error.type === 'entity.parse.failed';
  const responseStatus = isInvalidJson ? 400 : statusCode;
  const message = isInvalidJson
    ? 'Invalid JSON request body.'
    : statusCode === 500
      ? 'An unexpected server error occurred.'
      : error.message;

  logError(error, _request, responseStatus);

  response.status(responseStatus).json({
    success: false,
    message,
    errors: error.errors || [],
  });
};

module.exports = { errorHandler, notFoundHandler };
