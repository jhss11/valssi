import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class customProductController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const options = await this.prisma.customProduct.findMany({
        include: {
          baseProduct: {
            select: {
              name: true,
              price: true,
            },
          },
          customProducts: {
            include: {
              optionValue: {
                include: {
                  option: true,
                },
              },
            },
          },
          orderItems: {
            include: {
              order: {
                include: {
                  user: true,
                  statusLogs: {
                    include: {
                      changedBy: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      response.json(options);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { baseProductId, totalPrice, selections } = request.body;

      const newCustomProduct = await this.prisma.customProduct.create({
        data: {
          baseProductId,
          totalPrice,
          customProducts: {
            create: selections.map((s: { optionValueId: number }) => ({
              optionValue: { connect: { id: s.optionValueId } },
            })),
          },
        },
        include: {
          baseProduct: { select: { name: true, price: true } },
          customProducts: {
            include: {
              optionValue: { include: { option: true } },
            },
          },
        },
      });

      response.status(201).json(newCustomProduct);
    } catch (error) {
      next(error);
    }
  };
}
