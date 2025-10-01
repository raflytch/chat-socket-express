import bcrypt from "bcrypt";
import { config } from "../configs/environment";

/**
 * Hash password
 * @param password - Plain password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.saltRounds);
};

/**
 * Compare password
 * @param password - Plain password
 * @param hashedPassword - Hashed password
 * @returns True if match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
