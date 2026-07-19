const express = require('express');
const { getUsers, getUserDetails, removeUser, getDashboardStats } = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require authentication + admin role
router.get('/stats', authenticate, authorizeAdmin, getDashboardStats);
router.get('/users', authenticate, authorizeAdmin, getUsers);
router.get('/users/:id', authenticate, authorizeAdmin, getUserDetails);
router.delete('/users/:id', authenticate, authorizeAdmin, removeUser);

module.exports = router;
