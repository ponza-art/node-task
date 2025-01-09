const { body } = require('express-validator');
const { validate } = require('../utils/validator');
const bytes = require('bytes');

const noteValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('messageBody').trim().notEmpty().withMessage('Message body is required'),
    body('typeId').isUUID().withMessage('Valid note type ID is required'),
    body('userIds').isArray().withMessage('User IDs must be an array')
        .notEmpty().withMessage('At least one user ID is required'),
    body('userIds.*').isUUID().withMessage('Invalid user ID format'),
    validate
];

const mediaValidation = (req, res, next) => {
    if (req.files) {
        const maxSize = bytes('1.7mb');
        const invalidFiles = req.files.filter(file => file.size > maxSize);
        
        if (invalidFiles.length > 0) {
            return res.status(422).json({
                error: 'File size exceeds maximum limit of 1.7MB',
                files: invalidFiles.map(f => f.originalname)
            });
        }
    }
    next();
};

module.exports = { noteValidation, mediaValidation }; 