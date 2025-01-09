const router = require('express').Router();
const { noteValidation, mediaValidation } = require('../middleware/validation');
const { Note, User, NoteType } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { paginationMiddleware } = require('../middleware/pagination');
const auth = require('../middleware/auth');

// Add auth middleware to all routes
router.use(auth);

// Send note to multiple users
router.post('/', upload.array('files'), noteValidation, mediaValidation, async (req, res) => {
    try {
        const { title, messageBody, typeId, userIds } = req.body;
        const mediaFiles = req.files.map(file => file.path);

        const note = await Note.create({
            title,
            messageBody,
            mediaFiles,
            noteTypeId: typeId
        });

        await note.setUsers(userIds);

        // Notify users through WebSocket
        global.ws.notifyUsers(userIds, {
            type: 'new-note',
            note
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get timeline notes
router.get('/timeline', paginationMiddleware, async (req, res) => {
    try {
        const { types } = req.query;
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const whereClause = {
            createdAt: { [Op.gte]: thirtyDaysAgo }
        };

        if (types) {
            whereClause.noteTypeId = types.split(',');
        }

        const notes = await Note.findAndCountAll({
            include: [
                {
                    model: NoteType,
                    where: { disabled: false }
                },
                {
                    model: User,
                    where: { id: req.user.id },
                    through: { attributes: [] }
                }
            ],
            where: whereClause,
            ...req.pagination
        });

        res.json({
            notes: notes.rows,
            total: notes.count,
            page: Math.floor(req.pagination.offset / req.pagination.limit) + 1,
            totalPages: Math.ceil(notes.count / req.pagination.limit)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Soft delete notes
router.delete('/', async (req, res) => {
    try {
        const { noteIds } = req.body;
        
        // Verify ownership before deletion
        const notes = await Note.findAll({
            include: [{
                model: User,
                where: { id: req.user.id }
            }],
            where: { id: noteIds }
        });

        if (notes.length !== noteIds.length) {
            return res.status(403).json({ error: 'Unauthorized to delete some notes' });
        }

        await Note.destroy({
            where: { id: noteIds }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 