import prisma from "../configs/prisma";
import { User } from "@prisma/client";
import { UserWithoutPassword } from "../type/user.type";

/**
 * User repository
 */
export class UserRepository {
  /**
   * Create user
   * @param data - User data
   * @returns Created user
   */
  static async create(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<User> {
    return await prisma.user.create({ data });
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User or null
   */
  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find user by id
   * @param id - User id
   * @returns User or null
   */
  static async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }
}
