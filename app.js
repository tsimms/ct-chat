const express = require('express');
const { resolve } = require('path');
const http = require('http');
const socketIo = require('socket.io');

const appPort = 3010;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle screen sharing event
  socket.on('msg', (message) => {
    // Broadcast the screen share stream to all clients (including the sender)
    console.log(`Received a message: ${message}`);
    const time = new Date().toLocaleTimeString();
    io.emit('msg', { time, message });
  });

  // Handle viewer's disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(appPort, () => {
  console.log(`App server (socket) is running on port ${appPort}`);
});
