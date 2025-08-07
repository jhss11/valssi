import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class orderController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener lista de pedidos
      const orders = await this.prisma.order.findMany({
        where: {
          NOT: {
            status: "CART",
          },
        },
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          user: {
            select: { username: true },
          },
          statusLogs: {
            where: { status: "PENDING_PAYMENT" },
            select: { changedAt: true },
            orderBy: { changedAt: "asc" },
            take: 1,
          },
        },
      });
      response.json(orders);
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      let idOrder = parseInt(request.params.id);

      const pedido = await this.prisma.order.findUnique({
        where: { id: idOrder },
        select: {
          id: true,
          createdAt: true,
          paymentMethod: true,
          subtotal: true,
          total: true,
          address: true,
          user: { select: { username: true } },
          statusLogs: {
            where: { status: "PENDING_PAYMENT" },
            select: { changedAt: true },
            orderBy: { changedAt: "asc" },
            take: 1,
          },
          items: {
            select: {
              quantity: true,
              price: true,
              product: {
                select: {
                  name: true,
                  promotions: {},
                  category: {
                    select: {
                      promotions: {},
                    },
                  },
                },
              },
              customProduct: {
                select: {
                  totalPrice: true,
                  baseProduct: {
                    select: {
                      name: true,
                      price: true,
                      promotions: {},
                      category: {
                        select: {
                          promotions: {},
                        },
                      },
                    },
                  },
                  customProducts: {
                    select: {
                      optionValue: {
                        select: {
                          value: true,
                          price: true,
                          option: {
                            select: { name: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      response.json(pedido);
      // return response.json(pedido);
    } catch (error: any) {
      console.error(error);
      next(error);
    }
  };

  //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      let infoOrden = request.body;
      const nuevoProducto = await this.prisma.order.create({
        data: {
          // : infoOrden.fechaOrden,    NO SÉ SI GUARDARLO PORQUE EN EL
          userId: infoOrden.userId,
          address: infoOrden.address,
          status: infoOrden.status,
          paymentMethod: infoOrden.paymentMethod,
          subtotal: infoOrden.subtotal,
          total: infoOrden.total,
          items: {
            create: infoOrden.productos.map((item: any) => ({
              productId: item.productId,
              price: item.price,
              quantity: item.quantity,
            })),
          },

          statusLogs: {
          create: [
            {
              status: infoOrden.status, 
              adminId: infoOrden.adminId, 
              // changedAt: nuevo Date() // opcional, Prisma lo hace
            },
          ],
        },
      }
        
      });
      response.status(201).json(nuevoProducto);
    } catch (error: any) {
      next(error);
    }
  };
}
