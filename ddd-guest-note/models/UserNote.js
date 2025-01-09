const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class UserNote extends Model {}

UserNote.init({
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    noteId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Notes',
            key: 'id'
        }
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'UserNote',
    tableName: 'UserNotes'
});

module.exports = UserNote; 