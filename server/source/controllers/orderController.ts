import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class orderController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener lista de pedidos
      const orders = await this.prisma.order.findMany({
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          user: {
            select: { username: true },
          },
        },
      });
      response.json(orders);
    } catch (error) {
      next(error);
    }
  };
}
