import { Request } from "express";

/**
 * User interface
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User without password
 */
export interface UserWithoutPassword {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Register request
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  message: string;
  token: string;
  user: UserWithoutPassword;
}

/**
 * Profile response
 */
export interface ProfileResponse {
  user: UserWithoutPassword;
}

/**
 * JWT payload
 */
export interface JWTPayload {
  id: number;
  email: string;
}

/**
 * Authenticated request
 */
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

/**
 * Register authenticated request
 */
export interface RegisterAuthenticatedRequest extends AuthenticatedRequest {
  body: RegisterRequest;
}

/**
 * Login authenticated request
 */
export interface LoginAuthenticatedRequest extends AuthenticatedRequest {
  body: LoginRequest;
}
