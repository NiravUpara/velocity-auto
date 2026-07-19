const db = require('../database/db');

/**
 * Record a new vehicle purchase.
 * @param {number} userId - The ID of the user purchasing
 * @param {number} vehicleId - The ID of the purchased vehicle
 * @param {number} quantity - Quantity purchased
 * @param {number} purchasePrice - The total or unit price of the purchase (we'll store unit price)
 * @returns {object} The created purchase record
 */
function createPurchase(userId, vehicleId, quantity, purchasePrice) {
  const stmt = db.prepare(
    'INSERT INTO purchases (user_id, vehicle_id, quantity, purchase_price) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(userId, vehicleId, quantity, purchasePrice);
  return { id: result.lastInsertRowid, userId, vehicleId, quantity, purchasePrice };
}

/**
 * Get all purchases for a specific user, joining with the vehicles table.
 * @param {number} userId 
 * @returns {Array} List of purchase records with vehicle details
 */
function getPurchasesByUserId(userId) {
  return db.prepare(`
    SELECT 
      p.id as purchase_id,
      p.quantity as purchased_quantity,
      p.purchase_price,
      p.purchase_date,
      v.id as vehicle_id,
      v.make,
      v.model,
      v.category
    FROM purchases p
    JOIN vehicles v ON p.vehicle_id = v.id
    WHERE p.user_id = ?
    ORDER BY p.purchase_date DESC
  `).all(userId);
}

module.exports = {
  createPurchase,
  getPurchasesByUserId
};
