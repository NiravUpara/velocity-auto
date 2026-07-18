const {
  getAllVehicles,
  searchVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../models/vehicleModel');

/**
 * GET /api/vehicles
 * Returns all vehicles in the inventory.
 */
function getAll(req, res) {
  try {
    const vehicles = getAllVehicles();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
}

/**
 * GET /api/vehicles/search?q=query
 * Searches vehicles by make, model, or category.
 */
function search(req, res) {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    const vehicles = searchVehicles(q);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}

/**
 * POST /api/vehicles
 * Creates a new vehicle. Admin only.
 */
function create(req, res) {
  try {
    const { make, model, category, price, quantity } = req.body;

    // Validate all required fields
    if (!make || !model || !category || price == null || quantity == null) {
      return res.status(400).json({ error: 'All fields are required: make, model, category, price, quantity' });
    }

    if (price < 0 || quantity < 0) {
      return res.status(400).json({ error: 'Price and quantity must be non-negative' });
    }

    const vehicle = createVehicle(make, model, category, price, quantity);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
}

/**
 * PUT /api/vehicles/:id
 * Updates an existing vehicle. Admin only.
 */
function update(req, res) {
  try {
    const { id } = req.params;
    const { make, model, category, price, quantity } = req.body;

    // Only allow known fields to be updated
    const fields = {};
    if (make !== undefined) fields.make = make;
    if (model !== undefined) fields.model = model;
    if (category !== undefined) fields.category = category;
    if (price !== undefined) fields.price = price;
    if (quantity !== undefined) fields.quantity = quantity;

    // Validate numeric fields if provided
    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: 'Price must be non-negative' });
    }
    if (quantity !== undefined && quantity < 0) {
      return res.status(400).json({ error: 'Quantity must be non-negative' });
    }

    const vehicle = updateVehicle(Number(id), fields);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
}

/**
 * DELETE /api/vehicles/:id
 * Deletes a vehicle from the inventory. Admin only.
 */
function remove(req, res) {
  try {
    const { id } = req.params;

    const deleted = deleteVehicle(Number(id));
    if (!deleted) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
}

module.exports = { getAll, search, create, update, remove };
