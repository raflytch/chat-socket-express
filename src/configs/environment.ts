import dotenv from "dotenv";

/**
 * Load environment variables
 */
dotenv.config();

/**
 * Environment configuration
 */
export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  saltRounds: parseInt(process.env.SALT_ROUNDS || "10"),
};
