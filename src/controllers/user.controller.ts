import { Response } from "express";
import { UserService } from "../services/user.service";
import {
  RegisterAuthenticatedRequest,
  LoginAuthenticatedRequest,
  AuthenticatedRequest,
} from "../type/user.type";

/**
 * User controller
 */
export class UserController {
  /**
   * Register user
   * @param req - Express request
   * @param res - Express response
   */
  static async register(req: RegisterAuthenticatedRequest, res: Response) {
    try {
      const { username, email, password } = req.body;
      const user = await UserService.register(username, email, password);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Login user
   * @param req - Express request
   * @param res - Express response
   */
  static async login(req: LoginAuthenticatedRequest, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      res.json({ message: "Login successful", ...result });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  /**
   * Get user profile
   * @param req - Express request
   * @param res - Express response
   */
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const user = await UserService.getProfile(userId);
      res.json({ user });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}
