const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const ACTIONS = require('./src/Actions');
const path = require('path');const io = new Server(server, {
    cors: {
      origin: ['https://peershare-pk64.onrender.com', 'http://localhost:3000'], // Ensure this matches your deployed app's URL and local development
      methods: ['GET', 'POST'],
      credentials: true, // If you require authentication/cookies
    },
  });
app.use(cors({
    origin: ['https://peershare-pk64.onrender.com', 'http://localhost:3000'], // Allows connections from the deployed app and local development
    methods: ['GET', 'POST'], // Specifies allowed HTTP methods
    credentials: true, // Allows the use of cookies/credentials if required
  }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        console.log(roomId);
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    })
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

