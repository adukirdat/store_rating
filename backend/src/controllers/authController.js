const authService = require('../services/authService');

const signup = async (request, response, next) => {
  try {
    const user = await authService.signup(request.body);
    response.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (request, response, next) => {
  try {
    const session = await authService.login(request.body);
    response.status(200).json({
      success: true,
      message: 'Login successful.',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (request, response, next) => {
  try {
    await authService.updatePassword({
      userId: request.user.userId,
      currentPassword: request.body.currentPassword,
      newPassword: request.body.newPassword,
    });

    response.status(200).json({
      success: true,
      message: 'Password updated successfully.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, signup, updatePassword };
