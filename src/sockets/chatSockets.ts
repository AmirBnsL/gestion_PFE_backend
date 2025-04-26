import type { Server, Socket } from 'socket.io';
import { uploadFile } from '../services/fileService';
import {
  saveMessage,
  markMessagesAsRead,
  getMessagesForRoom,
} from '../services/messageService';
import { getUserFromToken } from '../services/externalAuthService';
import type { ChatUser } from '../types/user';
import { create } from 'domain';
import { createJwtHandler } from '../middleware/authJwt';
import { User } from '../entities/User';

// Track users in rooms and their typing status
interface UserStatus {
  id: number;
  room: string;
  isTyping: boolean;
  lastActivity: Date;
}

// Track active users
const activeUsers = new Map<string, UserStatus>();

// Track users who are typing
const typingUsers = new Map<string, NodeJS.Timeout>();

export default function chatSockets(io: Server) {
  // Middleware for authentication using existing JWT auth service
  io.use(async (socket, next) => {
    try {
      // Get token from handshake auth
      await createJwtHandler({ socket: socket }, next);

      // Attach user to socket for later use
      console.log('Socket user:', (socket as any).user);
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  // Main chat namespace (default namespace)
  io.on('connection', async (socket: Socket) => {
    const user = (socket as any).user as User;
    console.log(
      `User ${user.id} (${user.email}) connected to chat:`,
      socket.id,
    );

    // Join a room
    socket.on('joinRoom', async ({ room }) => {
      socket.join(room);
      console.log(`User ${user.id} joined room ${room}`);

      // Add user to active users
      activeUsers.set(socket.id, {
        id: user.id,
        room,
        isTyping: false,
        lastActivity: new Date(),
      });

      // Notify others in the room
      socket.to(room).emit('message', `${user.email} has joined the room.`);

      // Send room history to the user
      const messages = await getMessagesForRoom(room);
      socket.emit('roomHistory', messages);

      // Notify others about active users in the room
      const roomUsers = Array.from(activeUsers.values())
        .filter(u => u.room === room)
        .map(u => ({ id: u.id, isTyping: u.isTyping }));

      io.to(room).emit('roomUsers', roomUsers);
    });

    // Handle chat messages
    socket.on('chatMessage', async ({ room, message, sender }) => {
      console.log(`Message from ${sender} in room ${room}: ${message}`);

      // Update user's last activity
      const userStatus = activeUsers.get(socket.id);
      if (userStatus) {
        userStatus.lastActivity = new Date();
        activeUsers.set(socket.id, userStatus);
      }

      // Create message object
      const messageObj = {
        sender: user.id,
        senderName: user.email,
        room,
        message,
        timestamp: new Date(),
        read: [user.id], // Mark as read by sender
        attachments: [],
      };

      // Save message to database
      const savedMessage = await saveMessage(messageObj);

      // Send to all clients in the room, including sender
      io.to(room).emit('chatMessage', {
        id: savedMessage.id,
        sender: user.email,
        senderId: user.id,
        message,
        timestamp: savedMessage.timestamp,
        attachments: savedMessage.attachments,
      });

      // Clear typing indicator for this user
      clearTypingIndicator(socket, room);
    });

    // Handle file uploads
    socket.on('fileUpload', async ({ room, file, fileType, fileName }) => {
      try {
        // Upload file to storage
        const fileData = Buffer.from(file, 'base64');
        const uploadResult = await uploadFile(fileData, fileName, fileType);

        // Create message with attachment
        const messageObj = {
          sender: user.id,
          senderName: user.email,
          room,
          message: `[File: ${fileName}]`,
          timestamp: new Date(),
          read: [user.id], // Mark as read by sender
          attachments: [
            {
              url: uploadResult.url,
              fileName,
              fileType,
              fileSize: fileData.length,
            },
          ],
        };

        // Save message to database
        const savedMessage = await saveMessage(messageObj);

        // Send to all clients in the room
        io.to(room).emit('chatMessage', {
          id: savedMessage.id,
          sender: user.email,
          senderId: user.id,
          message: messageObj.message,
          timestamp: savedMessage.timestamp,
          attachments: savedMessage.attachments,
        });
      } catch (error) {
        console.error('File upload error:', error);
        socket.emit('error', { message: 'Failed to upload file' });
      }
    });

    // Handle typing indicators
    socket.on('typing', ({ room }) => {
      const userStatus = activeUsers.get(socket.id);
      if (userStatus) {
        userStatus.isTyping = true;
        activeUsers.set(socket.id, userStatus);

        // Notify room that user is typing
        socket.to(room).emit('userTyping', {
          userId: user.id,
          userName: user.email,
          isTyping: true,
        });

        // Clear previous timeout if exists
        if (typingUsers.has(socket.id)) {
          clearTimeout(typingUsers.get(socket.id)!);
        }

        // Set timeout to clear typing indicator after 3 seconds
        const timeout = setTimeout(() => {
          clearTypingIndicator(socket, room);
        }, 3000);

        typingUsers.set(socket.id, timeout);
      }
    });

    // Handle read receipts
    socket.on('markAsRead', async ({ room, messageIds }) => {
      // Mark messages as read in database
      await markMessagesAsRead(messageIds, user.id);

      // Notify room about read messages
      socket.to(room).emit('messagesRead', {
        userId: user.id,
        userName: user.email,
        messageIds,
      });
    });

    // Leave a room
    socket.on('leaveRoom', ({ room }) => {
      socket.leave(room);
      console.log(`User ${user.id} left room ${room}`);

      // Remove user from active users for this room
      if (activeUsers.has(socket.id)) {
        activeUsers.delete(socket.id);
      }

      // Clear typing indicator if exists
      clearTypingIndicator(socket, room);

      // Notify others in the room
      socket.to(room).emit('message', `${user.email} has left the room.`);

      // Update active users list
      const roomUsers = Array.from(activeUsers.values())
        .filter(u => u.room === room)
        .map(u => ({ id: u.id, isTyping: u.isTyping }));

      io.to(room).emit('roomUsers', roomUsers);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${user.id} disconnected from chat:`, socket.id);

      // Get user's room before removing from active users
      const userStatus = activeUsers.get(socket.id);
      if (userStatus) {
        const room = userStatus.room;

        // Remove user from active users
        activeUsers.delete(socket.id);

        // Clear typing indicator if exists
        clearTypingIndicator(socket, room);

        // Notify room that user has left
        socket.to(room).emit('message', `${user.email} has disconnected.`);

        // Update active users list
        const roomUsers = Array.from(activeUsers.values())
          .filter(u => u.room === room)
          .map(u => ({ id: u.id, isTyping: u.isTyping }));

        io.to(room).emit('roomUsers', roomUsers);
      }

      // Clear typing timeout if exists
      if (typingUsers.has(socket.id)) {
        clearTimeout(typingUsers.get(socket.id)!);
        typingUsers.delete(socket.id);
      }
    });
  });

  // Helper function to clear typing indicator
  function clearTypingIndicator(socket: Socket, room: string) {
    const userStatus = activeUsers.get(socket.id);
    if (userStatus && userStatus.isTyping) {
      userStatus.isTyping = false;
      activeUsers.set(socket.id, userStatus);

      const user = (socket as any).user as User;
      socket.to(room).emit('userTyping', {
        userId: user.id,
        userName: user.email,
        isTyping: false,
      });

      // Clear timeout if exists
      if (typingUsers.has(socket.id)) {
        clearTimeout(typingUsers.get(socket.id)!);
        typingUsers.delete(socket.id);
      }
    }
  }

  // Create a separate namespace for announcements
  const announcements = io.of('/announcements');

  announcements.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication token is required'));
      }

      // If token is in "Bearer token" format, extract the token part
      const tokenValue = token.startsWith('Bearer ')
        ? token.split(' ')[1]
        : token;

      // Use the existing auth service to verify the token and get user info
      const user = await getUserFromToken(tokenValue);

      if (!user) {
        return next(new Error('Invalid authentication token'));
      }
      // Attach user to socket for later use
      (socket as any).user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  announcements.on('connection', (socket: Socket) => {
    const user = (socket as any).user as User;
    console.log(
      `User ${user.id} (${user.email}) connected to announcements:`,
      socket.id,
    );

    // Only admin can publish announcements
    socket.on('publishAnnouncement', async data => {
      if (user.role === 'admin') {
        console.log(`Admin published announcement: ${data.message}`);

        // Save announcement to database
        const announcement = {
          sender: user.id,
          message: data.message,
          timestamp: new Date(),
        };

        // Broadcast to all clients in the announcements namespace
        announcements.emit('announcement', {
          message: data.message,
          sender: user.email,
          timestamp: announcement.timestamp,
        });
      } else {
        console.log('Non-admin tried to publish announcement');
        // Notify the sender that they don't have permission
        socket.emit('error', {
          message: 'You do not have permission to publish announcements',
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(
        `User ${user.id} disconnected from announcements:`,
        socket.id,
      );
    });
  });

  return io;
}
