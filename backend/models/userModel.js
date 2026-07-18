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

module.exports = { createUser, findUserByUsername };
