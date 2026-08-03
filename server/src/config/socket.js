import { Server } from 'socket.io';

let io;

export function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      socket.data.token = token;
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    
    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    
    socket.on('join:role', (role) => {
      socket.join(`role:${role}`);
      console.log(`🏷️  Joined role room: ${role}`);
    });

    
    socket.on('join:society', (societyId) => {
      socket.join(`society:${societyId}`);
    });

    
    socket.on('chat:message', (data) => {
      io.to(`society:${data.societyId}`).emit('chat:message', data);
    });

    
    socket.on('sos:trigger', (data) => {
      io.to(`role:security`).emit('sos:alert', data);
      io.to(`role:committee`).emit('sos:alert', data);
      io.to(`role:maintenance`).emit('sos:alert', data);
      console.log(`🆘 SOS triggered by user: ${data.userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
}


export function emitToUser(userId, event, data) {
  if (io) io.to(`user:${userId}`).emit(event, data);
}


export function emitToRole(role, event, data) {
  if (io) io.to(`role:${role}`).emit(event, data);
}


export function emitToSociety(societyId, event, data) {
  if (io) io.to(`society:${societyId}`).emit(event, data);
}
