import type { Server, Socket } from 'socket.io';

interface User {
  id: string;
  room: string;
}

export default function chatSockets(io: Server) {
  // Main chat namespace (default namespace)
  io.on('connection', (socket: Socket) => {
    console.log('A user connected to chat:', socket.id);

    // Join a room
    socket.on('joinRoom', (user: User) => {
      socket.join(user.room);
      console.log(`User ${user.id} joined room ${user.room}`);
      // Notify others in the room
      socket.to(user.room).emit('message', `${user.id} has joined the room.`);
    });

    // Handle chat messages
    socket.on('chatMessage', ({ room, message, sender }) => {
      console.log(`Message from ${sender} in room ${room}: ${message}`);
      // Send to all clients in the room, including sender
      io.to(room).emit('chatMessage', { sender, message });
    });

    // Leave a room
    socket.on('leaveRoom', (user: User) => {
      socket.leave(user.room);
      console.log(`User ${user.id} left room ${user.room}`);
      // Notify others in the room
      socket.to(user.room).emit('message', `${user.id} has left the room.`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected from chat:', socket.id);
    });
  });

  // Create a separate namespace for announcements
  const announcements = io.of('/announcements');

  announcements.on('connection', (socket: Socket) => {
    console.log('A user connected to announcements:', socket.id);

    // Only admin can publish announcements
    socket.on('publishAnnouncement', data => {
      if (data.isAdmin) {
        console.log(`Admin published announcement: ${data.message}`);
        // Broadcast to all clients in the announcements namespace
        announcements.emit('announcement', {
          message: data.message,
          timestamp: new Date(),
        });
      } else {
        console.log('Non-admin tried to publish announcement');
        // Optionally notify the sender that they don't have permission
        socket.emit('error', {
          message: 'You do not have permission to publish announcements',
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected from announcements:', socket.id);
    });
  });

  return io;
}
