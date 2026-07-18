const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register - Create a new user account
router.post('/register', register);

// POST /api/auth/login - Authenticate and get a JWT token
router.post('/login', login);

module.exports = router;
