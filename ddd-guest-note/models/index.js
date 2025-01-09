const User = require('./User');
const Note = require('./Note');
const NoteType = require('./NoteType');
const UserNote = require('./UserNote');

// Set up associations with explicit foreign keys
User.belongsToMany(Note, { 
    through: UserNote,
    foreignKey: 'userId',
    otherKey: 'noteId'
});

Note.belongsToMany(User, { 
    through: UserNote,
    foreignKey: 'noteId',
    otherKey: 'userId'
});

Note.belongsTo(NoteType, {
    foreignKey: 'noteTypeId'
});

NoteType.hasMany(Note, {
    foreignKey: 'noteTypeId'
});

module.exports = {
    User,
    Note,
    NoteType,
    UserNote
}; 