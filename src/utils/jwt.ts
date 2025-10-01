import jwt from "jsonwebtoken";
import { config } from "../configs/environment";
import { JWTPayload } from "../type/user.type";

/**
 * Generate JWT token
 * @param payload - Payload data
 * @returns JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });
};

/**
 * Verify JWT token
 * @param token - JWT token
 * @returns Decoded payload
 */
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwtSecret) as JWTPayload;
};
