const { getVehicleById, updateVehicle } = require('../models/vehicleModel');
const { createPurchase, getPurchasesByUserId } = require('../models/purchaseModel');

/**
 * POST /api/vehicles/:id/purchase
 * Decrements vehicle quantity by requested amount (default 1). Fails if out of stock or insufficient stock.
 * Logs the purchase for the authenticated user.
 */
function purchaseVehicle(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const requestedQuantity = req.body?.quantity ? Number(req.body.quantity) : 1;

    if (requestedQuantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    const vehicle = getVehicleById(Number(id));

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (vehicle.quantity <= 0) {
      return res.status(400).json({ error: 'Vehicle is out of stock' });
    }

    if (vehicle.quantity < requestedQuantity) {
      return res.status(400).json({ error: 'Insufficient stock for this purchase' });
    }

    // Update vehicle quantity
    const updated = updateVehicle(Number(id), { quantity: vehicle.quantity - requestedQuantity });
    
    // Log the purchase
    createPurchase(userId, Number(id), requestedQuantity, vehicle.price);

    res.json({ message: 'Purchase successful', vehicle: updated });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
}

/**
 * POST /api/vehicles/:id/restock
 * Increments vehicle quantity. Admin only.
 * Expects { quantity: number } in the request body.
 */
function restockVehicle(req, res) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    const vehicle = getVehicleById(Number(id));
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const updated = updateVehicle(Number(id), { quantity: vehicle.quantity + quantity });
    res.json({ message: 'Restock successful', vehicle: updated });
  } catch (error) {
    res.status(500).json({ error: 'Restock failed' });
  }
}

/**
 * GET /api/purchases/my-garage
 * Returns the purchase history for the authenticated user.
 */
function getMyPurchases(req, res) {
  try {
    const userId = req.user.id;
    const purchases = getPurchasesByUserId(userId);
    res.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Failed to retrieve purchase history' });
  }
}

module.exports = { purchaseVehicle, restockVehicle, getMyPurchases };
