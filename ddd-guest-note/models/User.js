const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    profilePicture: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    },
    notificationEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User',
    paranoid: true // Enable soft deletes
});

module.exports = User; 