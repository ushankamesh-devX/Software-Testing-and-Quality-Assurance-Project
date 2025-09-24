const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/user/profile
router.get('/profile', authenticateToken, getProfile);

// PUT /api/user/profile
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;