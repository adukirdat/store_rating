const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { verifyToken } = require('../utils/jwt');

const authenticate = (request, _response, next) => {
  const authorization = request.headers.authorization;
  const [scheme, token, extraValue] = authorization ? authorization.split(' ') : [];

  if (scheme !== 'Bearer' || !token || extraValue) {
    return next(new AppError(401, 'Authentication token is required.'));
  }

  try {
    const payload = verifyToken(token);

    if (!payload.userId || !payload.role) {
      return next(new AppError(401, 'Authentication token is invalid.'));
    }

    request.user = {
      userId: payload.userId,
      role: payload.role,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(401, 'Authentication token has expired.'));
    }

    return next(new AppError(401, 'Authentication token is invalid.'));
  }
};

module.exports = authenticate;
