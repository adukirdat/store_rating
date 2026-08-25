const AppError = require('../utils/appError');
const { ROLE_VALUES } = require('../utils/roles');

const requireRole = (...allowedRoles) => {
  const hasUnsupportedRole = allowedRoles.some((role) => !ROLE_VALUES.includes(role));

  if (allowedRoles.length === 0 || hasUnsupportedRole) {
    throw new Error('requireRole must be configured with valid application roles.');
  }

  return (request, _response, next) => {
    if (!request.user || !request.user.role || !ROLE_VALUES.includes(request.user.role)) {
      return next(new AppError(403, 'Access denied'));
    }

    if (!allowedRoles.includes(request.user.role)) {
      return next(new AppError(403, 'Access denied'));
    }

    return next();
  };
};

module.exports = requireRole;
