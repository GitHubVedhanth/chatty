import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; 
const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
const userSocketMap ={}; //userid:socketid


io.on('connection', (socket) => {
  console.log('A user connected', socket.id);
  const userId = socket.handshake.query.userId
  if(userId){
    userSocketMap[userId]=socket.id
  }
  
  if (!userId) {
    console.warn(`⚠️ Socket connected with no userId, disconnecting: ${socket.id}`);
    socket.disconnect();
    return;
  }
  io.emit('getOnlineUsers',Object.keys(userSocketMap))
  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    delete userSocketMap[userId]
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
  });
});

export { io, app, server };
