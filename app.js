const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        
    }
});

// Middleware (optional)
app.use(express.static('public')); // Serve static files

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected',socket.id);

    socket.on('create room', (data) => {
        console.log(`Room created: ${data}`);
        socket.join(data);
    });

    socket.on('join room', (data) => {
        console.log(`Room joined: ${data}`);
        socket.join(data);
    });

    // Example: Listening for custom events
    socket.on('message', (data) => {
        console.log(`Message received: ${data}`);
        io.emit('message', data); // Broadcast the message to all clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
