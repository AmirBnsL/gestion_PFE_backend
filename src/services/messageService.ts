import { AppDataSource } from '../configs/datasource';
import { Message } from '../entities/Message';
import { Attachment } from '../entities/Attachment';
import { stringify } from 'querystring';

/**
 * Save a message to the database
 * @param messageData The message data to save
 * @returns The saved message
 */
export async function saveMessage(messageData: any) {
  const messageRepository = AppDataSource.getRepository(Message);
  const attachmentRepository = AppDataSource.getRepository(Attachment);

  // Create a new message
  const message = new Message();
  message.sender = messageData.sender;
  message.senderName = messageData.senderName;
  message.room = messageData.room;
  message.message = messageData.message;
  message.timestamp = messageData.timestamp;
  message.read = messageData.read || [];

  // Save the message first to get an ID
  const savedMessage = await messageRepository.save(message);

  // Process attachments if any
  if (messageData.attachments && messageData.attachments.length > 0) {
    const attachments = messageData.attachments.map((attachment: any) => {
      const newAttachment = new Attachment();
      newAttachment.message = savedMessage;
      newAttachment.url = attachment.url;
      newAttachment.fileName = attachment.fileName;
      newAttachment.fileType = attachment.fileType;
      newAttachment.fileSize = attachment.fileSize;
      return newAttachment;
    });

    // Save attachments
    const savedAttachments = await attachmentRepository.save(attachments);

    // Add attachments to the message
    savedMessage.attachments = savedAttachments;
  }

  return savedMessage;
}

/**
 * Get messages for a room
 * @param roomId The ID of the room
 * @param limit The maximum number of messages to return
 * @param offset The offset for pagination
 * @returns Array of messages
 */
export async function getMessagesForRoom(
  roomId: string,
  limit = 50,
  offset = 0,
) {
  const messageRepository = AppDataSource.getRepository(Message);

  // Get messages for the room with attachments
  const messages = await messageRepository
    .createQueryBuilder('message')
    .leftJoinAndSelect('message.attachments', 'attachment')
    .where('message.room = :roomId', { roomId })
    .orderBy('message.timestamp', 'DESC')
    .take(limit)
    .skip(offset)
    .getMany();

  // Return messages in ascending order (oldest first)
  return messages.reverse();
}

/**
 * Mark messages as read by a user
 * @param messageIds Array of message IDs
 * @param userId The ID of the user who read the messages
 */
export async function markMessagesAsRead(messageIds: string[], userId: number) {
  const messageRepository = AppDataSource.getRepository(Message);

  // Get messages by IDs
  const messages = await messageRepository.findByIds(messageIds);

  // Mark each message as read by the user
  for (const message of messages) {
    if (!message.read.includes(userId)) {
      message.read.push(userId);
    }
  }

  // Save updated messages
  await messageRepository.save(messages);
}

/**
 * Get unread message count for a user in a room
 * @param roomId The ID of the room
 * @param userId The ID of the user
 * @returns The number of unread messages
 */
export async function getUnreadMessageCount(roomId: string, userId: string) {
  const messageRepository = AppDataSource.getRepository(Message);

  // Count messages that don't have the user ID in the read array
  const count = await messageRepository
    .createQueryBuilder('message')
    .where('message.room = :roomId', { roomId })
    .andWhere('NOT (:userId = ANY(message.read))', { userId })
    .getCount();

  return count;
}

/**
 * Delete messages
 * @param messageIds Array of message IDs to delete
 */
export async function deleteMessages(messageIds: string[]) {
  const messageRepository = AppDataSource.getRepository(Message);

  // Delete messages by IDs
  await messageRepository.delete(messageIds);
}
