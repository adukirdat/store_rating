const express = require('express');
const ownerController = require('../controllers/ownerController');
const authenticate = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const { ROLES } = require('../utils/roles');

const router = express.Router();

router.get(
  '/dashboard',
  authenticate,
  requireRole(ROLES.STORE_OWNER),
  ownerController.getDashboard,
);

module.exports = router;
