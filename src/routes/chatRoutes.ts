import express from 'express';
import { jwtFilter } from '../middleware/authJwt';
import { upload } from '../services/fileService';
import {
  getMessagesForRoom,
  getUnreadMessageCount,
} from '../services/messageService';

const router = express.Router();

// Get messages for a room
router.get(
  '/messages/:roomId',
  jwtFilter,
  async (req: express.Request, res: express.Response) => {
    try {
      const { roomId } = req.params;
      const { limit, offset } = req.query;

      const messages = await getMessagesForRoom(
        roomId,
        limit ? Number.parseInt(limit as string) : 50,
        offset ? Number.parseInt(offset as string) : 0,
      );

      res.json(messages);
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ message: 'Failed to get messages' });
    }
  },
);

// Get unread message count for a room
router.get(
  '/messages/unread/:roomId',
  jwtFilter,
  async (req: express.Request, res: express.Response) => {
    try {
      const { roomId } = req.params;
      const userId = (req as any).user.id;

      const count = await getUnreadMessageCount(roomId, userId);

      res.json({ count });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({ message: 'Failed to get unread count' });
    }
  },
);

// Upload file for chat
router.post(
  '/upload',
  jwtFilter,
  upload.single('file'),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      // File is already saved by multer
      // Return the file URL
      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({
        url: fileUrl,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Failed to upload file' });
    }
  },
);

export default router;
