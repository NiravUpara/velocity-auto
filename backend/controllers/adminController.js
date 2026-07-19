const { getAllUsers, getUserById, deleteUser } = require('../models/userModel');
const { getPurchasesByUserId } = require('../models/purchaseModel');
const { getAllVehicles } = require('../models/vehicleModel');
const db = require('../database/db');

/**
 * GET /api/admin/users
 * Returns all users with their purchase counts.
 */
function getUsers(req, res) {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

/**
 * GET /api/admin/users/:id
 * Returns a single user's details with their purchase history.
 */
function getUserDetails(req, res) {
  try {
    const { id } = req.params;
    const user = getUserById(Number(id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const purchases = getPurchasesByUserId(Number(id));
    res.json({ ...user, purchases });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
}

/**
 * DELETE /api/admin/users/:id
 * Deletes a user. Admins cannot delete themselves.
 */
function removeUser(req, res) {
  try {
    const { id } = req.params;
    const targetId = Number(id);

    // Prevent admin from deleting themselves
    if (req.user.id === targetId) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const deleted = deleteUser(targetId);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

/**
 * GET /api/admin/stats
 * Returns dashboard statistics.
 */
function getDashboardStats(req, res) {
  try {
    const vehicles = getAllVehicles();
    const totalVehicles = vehicles.length;
    const outOfStock = vehicles.filter(v => v.quantity === 0).length;

    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

    const purchaseStats = db.prepare(
      'SELECT COALESCE(SUM(quantity), 0) as total_purchases, COALESCE(SUM(quantity * purchase_price), 0) as total_revenue FROM purchases'
    ).get();

    res.json({
      totalVehicles,
      totalUsers,
      totalPurchases: purchaseStats.total_purchases,
      totalRevenue: purchaseStats.total_revenue,
      outOfStock
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
}

module.exports = { getUsers, getUserDetails, removeUser, getDashboardStats };
