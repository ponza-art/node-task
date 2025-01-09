const fs = require('fs');
const path = require('path');

// Create necessary directories for testing
const setupTestDirectories = () => {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    // Create test-files directory if it doesn't exist
    const testFilesDir = path.join(__dirname, '../test-files');
    if (!fs.existsSync(testFilesDir)) {
        fs.mkdirSync(testFilesDir);
    }
};

module.exports = { setupTestDirectories }; 