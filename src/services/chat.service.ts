import { ChatRepository } from "../repositories/chat.repository";
import { Chat } from "../type/chat.type";

/**
 * Chat service
 */
export class ChatService {
  /**
   * Create chat
   * @param content - Chat content
   * @param senderId - Sender ID
   * @returns Created chat
   */
  static async createChat(content: string, senderId: number): Promise<Chat> {
    const chat = await ChatRepository.create({ content, senderId });
    return {
      id: chat.id,
      content: chat.content,
      senderId: chat.senderId,
      sender: chat.sender,
      createdAt: chat.createdAt,
    };
  }

  /**
   * Get all chats
   * @returns All chats
   */
  static async getAllChats(): Promise<Chat[]> {
    const chats = await ChatRepository.findAll();
    return chats.map((chat) => ({
      id: chat.id,
      content: chat.content,
      senderId: chat.senderId,
      sender: chat.sender,
      createdAt: chat.createdAt,
    }));
  }

  /**
   * Get chats by sender
   * @param senderId - Sender ID
   * @returns Chats by sender
   */
  static async getChatsBySender(senderId: number): Promise<Chat[]> {
    const chats = await ChatRepository.findBySender(senderId);
    return chats.map((chat) => ({
      id: chat.id,
      content: chat.content,
      senderId: chat.senderId,
      sender: chat.sender,
      createdAt: chat.createdAt,
    }));
  }
}
