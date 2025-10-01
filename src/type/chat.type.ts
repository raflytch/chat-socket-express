import { UserWithoutPassword } from "./user.type";

/**
 * Chat interface
 */
export interface Chat {
  id: number;
  content: string;
  senderId: number;
  sender: UserWithoutPassword;
  createdAt: Date;
}

/**
 * Create chat request
 */
export interface CreateChatRequest {
  content: string;
}

/**
 * Chat response
 */
export interface ChatResponse {
  chat: Chat;
}

/**
 * Get chats response
 */
export interface GetChatsResponse {
  chats: Chat[];
}

/**
 * Socket events
 */
export enum SocketEvents {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  JOIN_ROOM = "join_room",
  LEAVE_ROOM = "leave_room",
  SEND_MESSAGE = "send_message",
  RECEIVE_MESSAGE = "receive_message",
  ERROR = "error",
  GET_CHAT_HISTORY = "get_chat_history",
  CHAT_HISTORY = "chat_history",
}

/**
 * Socket data for sending message
 */
export interface SendMessageData {
  content: string;
  roomId?: string;
}

/**
 * Socket data for receiving message
 */
export interface ReceiveMessageData {
  chat: Chat;
  roomId?: string;
}

/**
 * Socket data for chat history
 */
export interface ChatHistoryData {
  chats: Chat[];
  roomId?: string;
}
