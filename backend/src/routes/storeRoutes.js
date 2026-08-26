const express = require('express');
const storeController = require('../controllers/storeController');
const authenticate = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const validateRequest = require('../middleware/validateRequest');
const { ROLES } = require('../utils/roles');
const { listStoresValidator, rateStoreValidator } = require('../validators/storeValidator');

const router = express.Router();
const requireNormalUser = [authenticate, requireRole(ROLES.NORMAL_USER)];

router.get('/', ...requireNormalUser, listStoresValidator, validateRequest, storeController.listStores);
router.post('/:storeId/rate', ...requireNormalUser, rateStoreValidator, validateRequest, storeController.rateStore);

module.exports = router;
