const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);

module.exports = router;
