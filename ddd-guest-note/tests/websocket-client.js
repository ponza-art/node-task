const WebSocket = require('ws');

const token = 'YOUR_TOKEN'; // Replace with actual token
const ws = new WebSocket(`ws://localhost:3000?token=${token}`);

ws.on('open', () => {
    console.log('Connected to WebSocket server');
});

ws.on('message', (data) => {
    console.log('Received:', JSON.parse(data));
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});