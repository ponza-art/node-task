const { NoteType, User } = require('../models');
const sequelize = require('../config/database');

async function seedData() {
    try {
        await sequelize.sync({ force: true }); // Warning: This will drop existing tables

        // Create note types
        const noteTypes = await NoteType.bulkCreate([
            { name: 'Congratulation' },
            { name: 'Invitation' },
            { name: 'Thank You' },
            { name: 'Welcome' }
        ]);

        // Create test users
        const users = await User.bulkCreate([
            { 
                name: 'John Doe',
                profilePicture: 'https://example.com/john.jpg',
                notificationEnabled: true
            },
            {
                name: 'Jane Smith',
                profilePicture: 'https://example.com/jane.jpg',
                notificationEnabled: true
            }
        ]);

        console.log('Seed data created successfully');
        console.log('Note Types:', noteTypes.map(t => ({ id: t.id, name: t.name })));
        console.log('Users:', users.map(u => ({ id: u.id, name: u.name })));

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await sequelize.close();
    }
}

seedData(); 