const { getAllUsers, getUserById, deleteUser } = require('../models/userModel');
const { getPurchasesByUserId, getAllPurchases } = require('../models/purchaseModel');
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

    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role != ?').get('admin').count;

    const purchaseStats = db.prepare(
      'SELECT COALESCE(SUM(quantity), 0) as total_purchases, COALESCE(SUM(total_amount), 0) as total_revenue FROM purchases'
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

/**
 * GET /api/admin/purchase-history
 * Returns full historical purchase ledger with analytics
 */
function getPurchaseHistory(req, res) {
  try {
    const purchases = getAllPurchases();
    
    // Compute analytics
    const totalTransactions = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.total_amount, 0);
    const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    // Compute today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaysSales = purchases
      .filter(p => p.purchase_date.startsWith(today))
      .reduce((sum, p) => sum + p.total_amount, 0);

    res.json({
      analytics: {
        totalRevenue,
        totalTransactions,
        todaysSales,
        averageOrderValue
      },
      purchases
    });
  } catch (error) {
    console.error('Purchase history error:', error);
    res.status(500).json({ error: 'Failed to fetch purchase history' });
  }
}

module.exports = { getUsers, getUserDetails, removeUser, getDashboardStats, getPurchaseHistory };
