const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user) throw new Error('User not found');
        return user;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = { verifyToken }; 