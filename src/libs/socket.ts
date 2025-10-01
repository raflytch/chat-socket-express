import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { verifyToken } from "../utils/jwt";
import { ChatService } from "../services/chat.service";
import { JWTPayload } from "../type/user.type";
import {
  SocketEvents,
  SendMessageData,
  ReceiveMessageData,
  ChatHistoryData,
} from "../type/chat.type";

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
 * Authenticate socket connection
 * @param socket - Socket instance
 * @param next - Next function
 */
const authenticateSocket = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  // Try handshake auth first (Socket.IO standard)
  let token = socket.handshake.auth?.token;

  // Fallback to query params for easier testing
  if (!token && socket.handshake.query?.token) {
    token = socket.handshake.query.token as string;
  }

  if (!token) {
    return next(
      new Error(
        "Authentication required. Provide token in auth object or query params (?token=...)"
      )
    );
  }

  try {
    const decoded = verifyToken(token);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
};

/**
 * Handle user connection
 * @param socket - Authenticated socket
 */
const handleConnection = (socket: AuthenticatedSocket) => {
  const user = socket.user!;
  console.log(`User connected: ${user.email} (ID: ${user.id})`);

  // Join user-specific room
  socket.join(`user_${user.id}`);

  // Handle room operations
  socket.on(SocketEvents.JOIN_ROOM, (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${user.email} joined room: ${roomId}`);
  });

  socket.on(SocketEvents.LEAVE_ROOM, (roomId: string) => {
    socket.leave(roomId);
    console.log(`User ${user.email} left room: ${roomId}`);
  });

  // Handle message sending
  socket.on(SocketEvents.SEND_MESSAGE, async (data: SendMessageData) => {
    try {
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
  });

  // Handle get chat history
  socket.on(
    SocketEvents.GET_CHAT_HISTORY,
    async (data?: { roomId?: string }) => {
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
    }
  );

  // Handle disconnection
  socket.on(SocketEvents.DISCONNECT, () => {
    console.log(`User disconnected: ${user.email}`);
  });
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
  io.on(SocketEvents.CONNECTION, handleConnection);
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
