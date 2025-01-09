const WebSocket = require('ws');
const { verifyToken } = require('../utils/auth');

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });
    const clients = new Map();

    wss.on('connection', async (ws, req) => {
        try {
            const token = req.url.split('=')[1];
            const user = await verifyToken(token);
            clients.set(user.id, ws);

            ws.on('close', () => {
                clients.delete(user.id);
            });
        } catch (error) {
            ws.close();
        }
    });

    return {
        notifyUsers: (userIds, message) => {
            userIds.forEach(userId => {
                const client = clients.get(userId);
                if (client) {
                    client.send(JSON.stringify(message));
                }
            });
        }
    };
};

module.exports = { setupWebSocket }; 