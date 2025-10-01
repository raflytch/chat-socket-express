import { Socket } from "socket.io";
import { JWTPayload } from "../../type/user.type";

/**
 * Extended socket interface
 */
interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

/**
 * Handle user connection
 * @param socket - Authenticated socket
 */
export const handleConnect = (socket: AuthenticatedSocket) => {
  const user = socket.user!;
  console.log(`User connected: ${user.email} (ID: ${user.id})`);

  // Join user-specific room
  socket.join(`user_${user.id}`);
};

/**
 * Handle user disconnection
 * @param socket - Authenticated socket
 */
export const handleDisconnect = (socket: AuthenticatedSocket) => {
  const user = socket.user!;
  console.log(`User disconnected: ${user.email}`);
};
