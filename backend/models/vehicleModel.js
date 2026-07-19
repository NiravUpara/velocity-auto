const db = require('../database/db');

/**
 * Get all vehicles from the database.
 * @returns {Array} List of all vehicles
 */
function getAllVehicles() {
  return db.prepare('SELECT * FROM vehicles').all();
}

/**
 * Search vehicles by make, model, or category.
 * Uses SQL LIKE for partial matching.
 * @param {string} query - Search term
 * @returns {Array} Matching vehicles
 */
function searchVehicles(query) {
  const searchTerm = `%${query}%`;
  return db.prepare(
    'SELECT * FROM vehicles WHERE make LIKE ? OR model LIKE ? OR category LIKE ?'
  ).all(searchTerm, searchTerm, searchTerm);
}

/**
 * Get a single vehicle by its ID.
 * @param {number} id
 * @returns {object|undefined} The vehicle, or undefined if not found
 */
function getVehicleById(id) {
  return db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
}

/**
 * Create a new vehicle.
 * @returns {object} The created vehicle
 */
function createVehicle(make, model, category, price, quantity, description) {
  const stmt = db.prepare(
    'INSERT INTO vehicles (make, model, category, price, quantity, description) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(make, model, category, price, quantity, description);
  return { id: result.lastInsertRowid, make, model, category, price, quantity, description };
}

/**
 * Update an existing vehicle.
 * @param {number} id
 * @param {object} fields - Fields to update { make, model, category, price, quantity }
 * @returns {object|null} Updated vehicle or null if not found
 */
function updateVehicle(id, fields) {
  const vehicle = getVehicleById(id);
  if (!vehicle) return null;

  const updated = { ...vehicle, ...fields };
  db.prepare(
    'UPDATE vehicles SET make = ?, model = ?, category = ?, price = ?, quantity = ?, description = ? WHERE id = ?'
  ).run(updated.make, updated.model, updated.category, updated.price, updated.quantity, updated.description, id);

  return updated;
}

/**
 * Delete a vehicle by ID.
 * @param {number} id
 * @returns {boolean} True if deleted, false if not found
 */
function deleteVehicle(id) {
  const result = db.prepare('DELETE FROM vehicles WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = {
  getAllVehicles,
  searchVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
