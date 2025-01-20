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
    console.log('A user connected', socket.id);

    socket.on('create room', (data) => {
        console.log(`Room created: ${data}`);
        socket.join(data);
    });

    socket.on('join room', (data) => {
        const roomSize = io.sockets.adapter.rooms.get(data)?.size || 0;
        console.log(`Room joined: ${data}`);
        if(roomSize<=2){
        socket.join(data);
        socket.to(data).emit('playerJoined', socket.id);
        } else{
            socket.emit('full');
        }
    });

    // Example: Listening for custom events
    socket.on('sendMessageToRoom', (roomId, message) => {
        console.log(`Message received from ${roomId}: ${message}`);
        socket.to(roomId).emit('message', { roomId, message }); // Broadcast the message to all clients in the room
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
