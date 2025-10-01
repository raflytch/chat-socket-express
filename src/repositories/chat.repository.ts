import prisma from "../configs/prisma";
import { Chat } from "@prisma/client";

/**
 * Chat repository
 */
export class ChatRepository {
  /**
   * Create chat
   * @param data - Chat data
   * @returns Created chat
   */
  static async create(data: {
    content: string;
    senderId: number;
  }): Promise<
    Chat & {
      sender: {
        id: number;
        username: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  > {
    return await prisma.chat.create({
      data,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  /**
   * Get all chats
   * @returns All chats with sender
   */
  static async findAll(): Promise<
    (Chat & {
      sender: {
        id: number;
        username: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
      };
    })[]
  > {
    return await prisma.chat.findMany({
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Get chats by sender
   * @param senderId - Sender ID
   * @returns Chats by sender
   */
  static async findBySender(
    senderId: number
  ): Promise<
    (Chat & {
      sender: {
        id: number;
        username: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
      };
    })[]
  > {
    return await prisma.chat.findMany({
      where: { senderId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
