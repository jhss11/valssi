import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class TagController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      // Obtener todos los tags ordenados alfabéticamente por nombre
      const tags = await this.prisma.tag.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      });
      response.json(tags);
    } catch (error) {
      next(error);
    }
  };
}
