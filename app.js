const express = require('express');
const { resolve } = require('path');
const http = require('http');
const socketIo = require('socket.io');

const appPort = 3010;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const history = [];
debugger;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'public/index.html'));
});

let currentUserCount = 0;

io.on('connection', (socket) => {
  console.log('A user connected');
  currentUserCount++;

  io.emit('userCountChange', { currentUserCount });

  // Handle screen sharing event
  socket.on('msg', (message) => {
    // Broadcast the screen share stream to all clients (including the sender)
    console.log(`Received a message: ${message}`);
    const time = new Date().toLocaleTimeString();
    const entry = { time, message };
    history.push(entry);

    io.emit('msg', { time, message });
  });

  socket.on('getHistory', () => {
    socket.emit('history', history);
  })

  // Handle viewer's disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    currentUserCount--;
    io.emit('userCountChange', { currentUserCount });
  });
});

server.listen(appPort, () => {
  console.log(`App server (socket) is running on port ${appPort}`);
});
