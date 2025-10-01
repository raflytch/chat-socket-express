import { Socket } from "socket.io";
import { JWTPayload } from "../../type/user.type";

/**
 * Extended socket interface
 */
interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

/**
 * Handle join room event
 * @param socket - Authenticated socket
 * @param roomId - Room ID
 */
export const handleJoinRoom = (socket: AuthenticatedSocket, roomId: string) => {
  const user = socket.user!;
  socket.join(roomId);
  console.log(`User ${user.email} joined room: ${roomId}`);
};

/**
 * Handle leave room event
 * @param socket - Authenticated socket
 * @param roomId - Room ID
 */
export const handleLeaveRoom = (
  socket: AuthenticatedSocket,
  roomId: string
) => {
  const user = socket.user!;
  socket.leave(roomId);
  console.log(`User ${user.email} left room: ${roomId}`);
};
