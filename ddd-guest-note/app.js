require('events').EventEmitter.defaultMaxListeners = 15;

const express = require('express');
const sequelize = require('./config/database');
const { setupWebSocket } = require('./services/websocket');
const { setupDailyNotifications } = require('./services/scheduler');

const app = express();
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// Database initialization
const initializeApp = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        // Sync database (in development, use {force: true} with caution)
        await sequelize.sync();
        console.log('Database synchronized successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    initializeApp().then(() => {
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Setup WebSocket
        global.ws = setupWebSocket(server);

        // Setup daily notifications
        setupDailyNotifications();
    });
}

module.exports = { app, initializeApp };
