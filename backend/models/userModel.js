const db = require('../database/db');

/**
 * Create a new user in the database.
 * @param {string} username
 * @param {string} hashedPassword - Already hashed with bcrypt
 * @param {string} role - 'user' or 'admin'
 * @returns {object} The created user's info (without password)
 */
function createUser(username, hashedPassword, role = 'user') {
  const stmt = db.prepare(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
  );
  const result = stmt.run(username, hashedPassword, role);
  return { id: result.lastInsertRowid, username, role };
}

/**
 * Find a user by their username.
 * @param {string} username
 * @returns {object|undefined} The user record, or undefined if not found
 */
function findUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

/**
 * Get all users with their purchase counts (excludes passwords).
 * @returns {Array}
 */
function getAllUsers() {
  return db.prepare(`
    SELECT 
      u.id,
      u.username,
      u.role,
      u.created_at,
      COALESCE(SUM(p.quantity), 0) as total_purchases
    FROM users u
    LEFT JOIN purchases p ON u.id = p.user_id
    WHERE u.role != 'admin'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();
}

/**
 * Get a single user by ID (excludes password).
 * @param {number} id
 * @returns {object|undefined}
 */
function getUserById(id) {
  return db.prepare(`
    SELECT 
      u.id,
      u.username,
      u.role,
      u.created_at,
      COALESCE(SUM(p.quantity), 0) as total_purchases
    FROM users u
    LEFT JOIN purchases p ON u.id = p.user_id
    WHERE u.id = ?
    GROUP BY u.id
  `).get(id);
}

/**
 * Delete a user by ID.
 * @param {number} id
 * @returns {boolean} True if deleted
 */
function deleteUser(id) {
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = { createUser, findUserByUsername, getAllUsers, getUserById, deleteUser };
