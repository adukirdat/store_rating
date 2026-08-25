const adminService = require('../services/adminService');

const getDashboardStats = async (_request, response, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    response.status(200).json({ success: true, message: 'Dashboard statistics retrieved.', data: stats });
  } catch (error) {
    next(error);
  }
};

const createUser = async (request, response, next) => {
  try {
    const user = await adminService.createUser(request.body);
    response.status(201).json({ success: true, message: 'User created successfully.', data: { user } });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (request, response, next) => {
  try {
    const users = await adminService.listUsers(request.query);
    response.status(200).json({ success: true, message: 'Users retrieved successfully.', data: { users } });
  } catch (error) {
    next(error);
  }
};

const getUserDetails = async (request, response, next) => {
  try {
    const user = await adminService.getUserDetails(request.params.userId);
    response.status(200).json({ success: true, message: 'User details retrieved successfully.', data: { user } });
  } catch (error) {
    next(error);
  }
};

const createStore = async (request, response, next) => {
  try {
    const store = await adminService.createStore(request.body);
    response.status(201).json({ success: true, message: 'Store created successfully.', data: { store } });
  } catch (error) {
    next(error);
  }
};

const listStores = async (request, response, next) => {
  try {
    const stores = await adminService.listStores(request.query);
    response.status(200).json({ success: true, message: 'Stores retrieved successfully.', data: { stores } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createStore, createUser, getDashboardStats, getUserDetails, listStores, listUsers };
