const ownerService = require('../services/ownerService');

const getDashboard = async (request, response, next) => {
  try {
    const store = await ownerService.getDashboard(request.user.userId);
    response.status(200).json({
      success: true,
      message: 'Owner dashboard retrieved successfully.',
      data: { store },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
