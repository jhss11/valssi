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
            select: { username: true,
              id: true
             },
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

   getByUserPendingP = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = Number(request.query.userId);
      //Obtener lista de pedidos
      const orders = await this.prisma.order.findMany({
        where: {
          userId: userId,
            status: "PENDING_PAYMENT",
        },
        select: {
          id: true,
          status: true,
          total: true,
          // user: {
          //   select: { username: true },
          // },
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

  


create = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const infoOrden = request.body;

    // Primero creamos la orden
    const nuevoProducto = await this.prisma.order.create({
      data: {
        userId: infoOrden.userId,
        address: infoOrden.address,
        status: infoOrden.status,
        paymentMethod: infoOrden.paymentMethod,
        subtotal: infoOrden.subtotal,
        total: infoOrden.total,
        items: {
          create: [], // los crearemos después manualmente para diferenciar
        },
        statusLogs: {
          create: [
            {
              status: infoOrden.status,
              changedAt: new Date(),
            },
          ],
        },
      },
    });

    // Procesamos cada item
    for (const item of infoOrden.items) {
      if (item.customizations && item.customizations.selectedOptions?.length > 0) {
        // Producto customizado
        const customProduct = await this.prisma.customProduct.create({
          data: {
            baseProductId: item.productId,
            totalPrice: item.customizations.totalPrice,
            customProducts: {
              create: item.customizations.selectedOptions.map((opt: any) => ({
                optionValue: { connect: { id: opt.optionValueId } },
              })),
            },
          },
        });

        await this.prisma.orderItem.create({
          data: {
            orderId: nuevoProducto.id,
            customProductId: customProduct.id,
            price: item.price,
            quantity: item.quantity,
          },
        });
         await this.prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

      } else {
        // Producto normal
        await this.prisma.orderItem.create({
          data: {
            orderId: nuevoProducto.id,
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
          },
        });

        // Descontar stock
        await this.prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    response.status(201).json(nuevoProducto);

  } catch (error: any) {
    next(error);
  }
};

}
