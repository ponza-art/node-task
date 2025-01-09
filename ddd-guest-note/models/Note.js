const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Note extends Model {}

Note.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    messageBody: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    mediaFiles: {
        type: DataTypes.JSON, // Array of file URLs/paths
        validate: {
            isValidMediaFiles(value) {
                if (!Array.isArray(value)) throw new Error('Media files must be an array');
                if (value.length > 5) throw new Error('Maximum 5 media files allowed');
            }
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Note',
    paranoid: true // Enable soft deletes
});

module.exports = Note; 