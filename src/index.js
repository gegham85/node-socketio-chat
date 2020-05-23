const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
// all we've done is we've created this server outside the Express library
// we've created ourselves and configure it to use our express app!
const server = http.createServer(app);

// socketio is expected to be called with raw HTTP server
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

// let count = 0;

io.on('connection', (socket) => {
    console.log('New WebSocket conneect');

    // emit to a particular connect
    socket.emit('message', 'welcome');

    // emit to everybody except this 'socket' (connection)
    socket.broadcast.emit('message', 'A new user has joined');

    // emit to everybody
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed');
        }

        io.emit('message', message);

        // we call this to acknowledge the event
        callback();
    });

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`);
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left');
    });

    /**
    // 'socket' is an object containing information about the new connection
    // we could use methods on 'socket' to communicate with that specific client
    socket.emit('countUpdated', count);

    socket.on('increment', () => {
        count++;

        // this will only send to that specific connection
        //socket.emit('countUpdated', count);

        // this will send to all open connections
        io.emit('countUpdated', count);

    });
    */
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});