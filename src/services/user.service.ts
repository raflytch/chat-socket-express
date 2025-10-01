import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import { UserWithoutPassword, LoginResponse } from "../type/user.type";

/**
 * User service
 */
export class UserService {
  /**
   * Register user
   * @param username - Username
   * @param email - Email
   * @param password - Password
   * @returns User data without password
   */
  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<UserWithoutPassword> {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await hashPassword(password);
    const user = await UserRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Login user
   * @param email - Email
   * @param password - Password
   * @returns Token and user data
   */
  static async login(
    email: string,
    password: string
  ): Promise<Omit<LoginResponse, "message">> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    const token = generateToken({ id: user.id, email: user.email });
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  /**
   * Get user profile
   * @param id - User id
   * @returns User data without password
   */
  static async getProfile(id: number): Promise<UserWithoutPassword> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
