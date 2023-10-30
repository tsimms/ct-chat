const express = require('express');
const { resolve } = require('path');
const http = require('http');
const socketIo = require('socket.io');

const appPort = 3010;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = {}
const getRandomColor = () => {
  const colors = [
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
    'black',
    'white'
  ];
  
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

const history = [];

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
    const { text, username } = message;
    if (!users[username]) {
      users[username] = {
        name: username,
        color: getRandomColor()
      }
    }

    const user = users[username];
    // Broadcast the screen share stream to all clients (including the sender)
    console.log(`Received a message: ${username}: ${text}`);
    const time = new Date().toLocaleTimeString();
    const entry = { time, user, text };
    history.push(entry);
    io.emit('msg', entry);
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
