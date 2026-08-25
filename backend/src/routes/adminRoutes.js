const express = require('express');
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const validateRequest = require('../middleware/validateRequest');
const { ROLES } = require('../utils/roles');
const {
  createStoreValidator,
  createUserValidator,
  listStoresValidator,
  listUsersValidator,
  userIdValidator,
} = require('../validators/adminValidator');

const router = express.Router();
const requireAdmin = [authenticate, requireRole(ROLES.ADMIN)];

router.get('/dashboard-stats', ...requireAdmin, adminController.getDashboardStats);
router.post('/users', ...requireAdmin, createUserValidator, validateRequest, adminController.createUser);
router.get('/users', ...requireAdmin, listUsersValidator, validateRequest, adminController.listUsers);
router.get('/users/:userId', ...requireAdmin, userIdValidator, validateRequest, adminController.getUserDetails);
router.post('/stores', ...requireAdmin, createStoreValidator, validateRequest, adminController.createStore);
router.get('/stores', ...requireAdmin, listStoresValidator, validateRequest, adminController.listStores);

module.exports = router;
