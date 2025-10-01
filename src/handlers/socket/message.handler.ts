import { Socket } from "socket.io";
import { ChatService } from "../../services/chat.service";
import { JWTPayload } from "../../type/user.type";
import {
  SocketEvents,
  SendMessageData,
  ReceiveMessageData,
} from "../../type/chat.type";

/**
 * Extended socket interface
 */
interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

/**
 * Handle send message event
 * @param socket - Authenticated socket
 * @param data - Message data
 */
export const handleSendMessage = async (
  socket: AuthenticatedSocket,
  data: SendMessageData
) => {
  try {
    const user = socket.user!;
    const chat = await ChatService.createChat(data.content, user.id);

    const messageData: ReceiveMessageData = {
      chat,
      roomId: data.roomId,
    };

    // Send to specific room or broadcast to all
    if (data.roomId) {
      socket.to(data.roomId).emit(SocketEvents.RECEIVE_MESSAGE, messageData);
    } else {
      socket.broadcast.emit(SocketEvents.RECEIVE_MESSAGE, messageData);
    }

    // Send back to sender
    socket.emit(SocketEvents.RECEIVE_MESSAGE, messageData);
  } catch (error: any) {
    socket.emit(SocketEvents.ERROR, { message: error.message });
  }
};
