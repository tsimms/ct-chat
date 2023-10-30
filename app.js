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
    'black'
  ];
  
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
const getTime = () => (new Date().toLocaleTimeString());
const getSystemEntry = (text) => {
  const entry = { time:getTime(), text }
  return entry;
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

  // Handle message event
  socket.on('msg', (message) => {
    const { text } = message;
    if (! (socket.nickname && users[socket.nickname]))  {
      users[socket.nickname] = {
        nickname: socket.nickname,
        color: getRandomColor()
      }
    }

    const user = users[socket.nickname];
    // Broadcast the message to all clients (including the sender)
    console.log(`Received a message: ${text}`);
    const entry = { time:getTime(), user, text };
    history.push(entry);
    io.emit('msg', entry);
  });

  socket.on('nickname', (nickname) => {
    console.log(`Setting nickname to ${nickname}`);
    socket.nickname = nickname;
    const entry = getSystemEntry(`<em>${socket.nickname}</em> joined.`);
    console.log(`Sent: ${JSON.stringify(entry)}`);
    history.push(entry);
    io.emit('msg', entry);
  })

  socket.on('getHistory', () => {
    socket.emit('history', history);
  })

  // Handle viewer's disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    currentUserCount--;
    io.emit('userCountChange', { currentUserCount });
    const entry = getSystemEntry(`<em>${socket.nickname}</em> left.`);
    console.log(`Sent: ${JSON.stringify(entry)}`);
    history.push(entry);
    io.emit('msg', entry);
  });
});

server.listen(appPort, () => {
  console.log(`App server (socket) is running on port ${appPort}`);
});
