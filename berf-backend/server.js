const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/berf', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/auth', authRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Berf Chat App Server is running');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
const chatRoutes = require('./routes/chat');
app.use('/chat', chatRoutes);
