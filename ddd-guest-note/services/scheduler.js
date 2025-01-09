const cron = require('node-cron');
const { Note, User, NoteType } = require('../models');
const { Op } = require('sequelize');

const setupDailyNotifications = () => {
    // Run at midnight every day
    cron.schedule('0 0 * * *', async () => {
        try {
            const users = await User.findAll({
                where: { notificationEnabled: true }
            });

            for (const user of users) {
                const yesterday = new Date(new Date() - 24*60*60*1000);
                
                const noteStats = await Note.findAll({
                    include: [
                        {
                            model: NoteType,
                            where: { isDisabled: false }
                        },
                        {
                            model: User,
                            where: { id: user.id },
                            through: { attributes: [] }
                        }
                    ],
                    where: {
                        createdAt: { [Op.gte]: yesterday }
                    }
                });

                if (noteStats.length > 0) {
                    // Group notes by type
                    const stats = noteStats.reduce((acc, note) => {
                        acc[note.NoteType.name] = (acc[note.NoteType.name] || 0) + 1;
                        return acc;
                    }, {});

                    // Format message
                    const message = Object.entries(stats)
                        .map(([type, count]) => `${count} ${type} notes`)
                        .join(', ');

                    // Send notification through WebSocket
                    global.ws.notifyUsers([user.id], {
                        type: 'daily-stats',
                        message: `You got new ${message} in the last 24 hours`
                    });
                }
            }
        } catch (error) {
            console.error('Daily notification error:', error);
        }
    });
};

module.exports = { setupDailyNotifications }; 