import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { JWTPayload } from "../type/user.type";
import { SocketEvents } from "../type/chat.type";
import { authenticateSocket } from "../middlewares/socket-auth.middleware";
import {
  handleConnect,
  handleDisconnect,
} from "../handlers/socket/connection.handler";
import {
  handleJoinRoom,
  handleLeaveRoom,
} from "../handlers/socket/room.handler";
import { handleSendMessage } from "../handlers/socket/message.handler";
import { handleGetChatHistory } from "../handlers/socket/history.handler";

/**
 * Extended socket interface
 */
interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

/**
 * Socket.IO server instance
 */
let io: SocketServer;

/**
 * Register socket event handlers
 * @param socket - Authenticated socket
 */
const registerSocketHandlers = (socket: AuthenticatedSocket) => {
  // Handle connection
  handleConnect(socket);

  // Handle room operations
  socket.on(SocketEvents.JOIN_ROOM, (roomId: string) =>
    handleJoinRoom(socket, roomId)
  );

  socket.on(SocketEvents.LEAVE_ROOM, (roomId: string) =>
    handleLeaveRoom(socket, roomId)
  );

  // Handle message sending
  socket.on(SocketEvents.SEND_MESSAGE, (data) =>
    handleSendMessage(socket, data)
  );

  // Handle get chat history
  socket.on(SocketEvents.GET_CHAT_HISTORY, (data) =>
    handleGetChatHistory(socket, data)
  );

  // Handle disconnection
  socket.on(SocketEvents.DISCONNECT, () => handleDisconnect(socket));
};

/**
 * Initialize Socket.IO
 * @param server - HTTP server
 */
export const initializeSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware
  io.use(authenticateSocket);

  // Connection handler
  io.on(SocketEvents.CONNECTION, registerSocketHandlers);
};

/**
 * Get Socket.IO instance
 * @returns Socket.IO server
 */
export const getIO = (): SocketServer => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

/**
 * Send message to specific user
 * @param userId - User ID
 * @param event - Event name
 * @param data - Event data
 */
export const sendToUser = (userId: number, event: string, data: any) => {
  io.to(`user_${userId}`).emit(event, data);
};

/**
 * Send message to room
 * @param roomId - Room ID
 * @param event - Event name
 * @param data - Event data
 */
export const sendToRoom = (roomId: string, event: string, data: any) => {
  io.to(roomId).emit(event, data);
};
