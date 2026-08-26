const express = require('express');
const ownerController = require('../controllers/ownerController');
const authenticate = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const validateRequest = require('../middleware/validateRequest');
const { ownerDashboardValidator } = require('../validators/ownerValidator');
const { ROLES } = require('../utils/roles');

const router = express.Router();

router.get(
  '/dashboard',
  authenticate,
  requireRole(ROLES.STORE_OWNER),
  ownerDashboardValidator,
  validateRequest,
  ownerController.getDashboard,
);

module.exports = router;
