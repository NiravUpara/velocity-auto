const express = require('express');
const { getMyPurchases } = require('../controllers/inventoryController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-garage', authenticate, getMyPurchases);

module.exports = router;
