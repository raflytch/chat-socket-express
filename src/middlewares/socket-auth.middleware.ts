import { Socket } from "socket.io";
import { verifyToken } from "../utils/jwt";
import { JWTPayload } from "../type/user.type";

/**
 * Extended socket interface
 */
interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

/**
 * Authenticate socket connection
 * @param socket - Socket instance
 * @param next - Next function
 */
export const authenticateSocket = (
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
