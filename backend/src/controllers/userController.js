const User = require('../models/User');
const mysql = require('mysql2/promise');

const getProfile = async (req, res) => {
    try {
        // User is attached by auth middleware
        res.json({
            user: req.user.toJSON()
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, email, full_name } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!username || !email) {
            return res.status(400).json({ error: 'Username and email are required' });
        }

        // Check if new email or username is already taken by another user
        if (email !== req.user.email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser && existingUser.id !== userId) {
                return res.status(409).json({ error: 'Email already taken' });
            }
        }

        if (username !== req.user.username) {
            const existingUser = await User.findByUsername(username);
            if (existingUser && existingUser.id !== userId) {
                return res.status(409).json({ error: 'Username already taken' });
            }
        }

        // Update user in database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        try {
            await connection.execute(
                'UPDATE users SET username = ?, email = ?, full_name = ? WHERE id = ?',
                [username, email, full_name || null, userId]
            );
            await connection.end();
        } catch (error) {
            await connection.end();
            throw error;
        }

        // Fetch updated user
        const updatedUser = await User.findByEmail(email);

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser.toJSON()
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile
};