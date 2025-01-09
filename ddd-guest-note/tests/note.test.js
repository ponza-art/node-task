const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, initializeApp } = require('../app');
const { User, Note, NoteType } = require('../models');
const path = require('path');
const { setupTestDirectories } = require('./setup/testSetup');
require('dotenv').config();

// Mock WebSocket notifications
global.ws = {
    notifyUsers: jest.fn()
};

let authToken;
let users;
let noteTypes;

beforeAll(async () => {
    // Setup test directories
    setupTestDirectories();
    
    // Initialize the app
    await initializeApp();
    
    // Create test data
    await NoteType.bulkCreate([
        { name: 'Test Type 1' },
        { name: 'Test Type 2' }
    ]);

    await User.bulkCreate([
        { 
            name: 'Test User 1',
            notificationEnabled: true
        },
        {
            name: 'Test User 2',
            notificationEnabled: true
        }
    ]);

    // Get test data
    users = await User.findAll();
    noteTypes = await NoteType.findAll();
    
    // Create auth token for testing
    authToken = jwt.sign({ userId: users[0].id }, process.env.JWT_SECRET);
});

afterAll(async () => {
    // Clean up database
    await Note.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    await NoteType.destroy({ where: {}, force: true });
    
    // Close database connection
    await require('../config/database').close();
});

describe('Note API', () => {
    test('Should create a new note with media', async () => {
        const testImagePath = path.join(__dirname, 'test-files/test-image.jpg');
        
        // Create a simple test file if it doesn't exist
        if (!require('fs').existsSync(testImagePath)) {
            require('fs').writeFileSync(testImagePath, 'test image content');
        }

        const response = await request(app)
            .post('/api/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .field('title', 'Test Note')
            .field('messageBody', 'This is a test note')
            .field('typeId', noteTypes[0].id)
            .field('userIds[]', users[1].id)
            .attach('files', testImagePath);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    test('Should get timeline notes', async () => {
        const response = await request(app)
            .get('/api/notes/timeline')
            .set('Authorization', `Bearer ${authToken}`)
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('notes');
        expect(response.body).toHaveProperty('total');
    });

    test('Should delete notes', async () => {
        // First create a note to delete
        const note = await Note.create({
            title: 'Note to Delete',
            messageBody: 'This note will be deleted',
            noteTypeId: noteTypes[0].id
        });
        await note.setUsers([users[0]]);

        const response = await request(app)
            .delete('/api/notes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ noteIds: [note.id] });

        expect(response.status).toBe(204);
    });
}); 