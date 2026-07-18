const express = require('express');
const { getAll, search, create, update, remove } = require('../controllers/vehicleController');
const { purchaseVehicle, restockVehicle } = require('../controllers/inventoryController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (require authentication only)
router.get('/', authenticate, getAll);               // GET /api/vehicles
router.get('/search', authenticate, search);          // GET /api/vehicles/search?q=...

// Admin-only routes
router.post('/', authenticate, authorizeAdmin, create);       // POST /api/vehicles
router.put('/:id', authenticate, authorizeAdmin, update);     // PUT /api/vehicles/:id
router.delete('/:id', authenticate, authorizeAdmin, remove);  // DELETE /api/vehicles/:id

// Inventory routes
router.post('/:id/purchase', authenticate, purchaseVehicle);                 // Any user
router.post('/:id/restock', authenticate, authorizeAdmin, restockVehicle);   // Admin only

module.exports = router;
