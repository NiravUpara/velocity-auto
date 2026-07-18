const { getVehicleById, updateVehicle } = require('../models/vehicleModel');

/**
 * POST /api/vehicles/:id/purchase
 * Decrements vehicle quantity by 1. Fails if out of stock.
 */
function purchaseVehicle(req, res) {
  try {
    const { id } = req.params;
    const vehicle = getVehicleById(Number(id));

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (vehicle.quantity <= 0) {
      return res.status(400).json({ error: 'Vehicle is out of stock' });
    }

    const updated = updateVehicle(Number(id), { quantity: vehicle.quantity - 1 });
    res.json({ message: 'Purchase successful', vehicle: updated });
  } catch (error) {
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

module.exports = { purchaseVehicle, restockVehicle };
