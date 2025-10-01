import { Socket } from "socket.io";
import { ChatService } from "../../services/chat.service";
import { JWTPayload } from "../../type/user.type";
import { SocketEvents, ChatHistoryData } from "../../type/chat.type";

/**
 * Extended socket interface
 */
interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

/**
 * Handle get chat history event
 * @param socket - Authenticated socket
 * @param data - Optional room data
 */
export const handleGetChatHistory = async (
  socket: AuthenticatedSocket,
  data?: { roomId?: string }
) => {
  try {
    const chats = await ChatService.getAllChats();

    const historyData: ChatHistoryData = {
      chats,
      roomId: data?.roomId,
    };

    socket.emit(SocketEvents.CHAT_HISTORY, historyData);
  } catch (error: any) {
    socket.emit(SocketEvents.ERROR, { message: error.message });
  }
};
