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
  // Fetch user and vehicle data to store as a snapshot
  const user = db.prepare('SELECT username FROM users WHERE id = ?').get(userId);
  const vehicle = db.prepare('SELECT make, model, category FROM vehicles WHERE id = ?').get(vehicleId);
  
  const vehicleImage = "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop";

  const stmt = db.prepare(
    `INSERT INTO purchases (user_id, vehicle_id, quantity, purchase_price, vehicle_make, vehicle_model, vehicle_category, vehicle_image, username) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  
  const result = stmt.run(
    userId, 
    vehicleId, 
    quantity, 
    purchasePrice,
    vehicle ? vehicle.make : 'Unknown',
    vehicle ? vehicle.model : 'Unknown',
    vehicle ? vehicle.category : 'Unknown',
    vehicleImage,
    user ? user.username : 'Unknown'
  );
  
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
      p.vehicle_id,
      p.vehicle_make as make,
      p.vehicle_model as model,
      p.vehicle_category as category,
      p.vehicle_image as image
    FROM purchases p
    WHERE p.user_id = ?
    ORDER BY p.purchase_date DESC
  `).all(userId);
}

module.exports = {
  createPurchase,
  getPurchasesByUserId
};
