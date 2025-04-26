import type { Server, Socket } from 'socket.io';

// This file is now optional since we've integrated announcements into chatSockets.ts
// You can either delete this file or use it as a separate module

export default function announcementsSocket(io: Server) {
  const announcements = io.of('/announcements');

  announcements.on('connection', (socket: Socket) => {
    console.log('Client connected to announcements namespace');

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
      console.log('A user disconnected from announcements');
    });
  });

  return announcements;
}
