const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class NoteType extends Model {}

NoteType.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    isDisabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'disabled'
    }
}, {
    sequelize,
    modelName: 'NoteType'
});

module.exports = NoteType; 