const router = require('express').Router();
const { User } = require('../models');
const { body } = require('express-validator');
const { validate } = require('../utils/validator');
const jwt = require('jsonwebtoken');

const userValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('profilePicture').optional().isURL().withMessage('Invalid profile picture URL'),
    body('notificationEnabled').optional().isBoolean().withMessage('Must be boolean'),
    validate
];

// Create user
router.post('/', userValidation, async (req, res) => {
    try {
        const user = await User.create(req.body);
        
        // Generate token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        
        res.status(201).json({
            user,
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update notification preferences
router.patch('/:id/notifications', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await user.update({ notificationEnabled: req.body.enabled });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 