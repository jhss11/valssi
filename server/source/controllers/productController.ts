import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";
export class ProductController {
  prisma = new PrismaClient();
  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener tods los productos ordenadas por la fecha  de forma descendente
      const products = await this.prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          price: true,
          averageRating: true,
          images: {
            select: { url: true },
            take: 1,
            orderBy: { id: "asc" }, // o "desc" para la última
          },
        },
      });

      response.json(products);
    } catch (error) {
      next(error);
    }
  };

  //Obtener por Id
  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      let idProduct = parseInt(request.params.id);
      const product = await this.prisma.product.findUnique({
        where: { id: idProduct },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          averageRating: true,
          category: {
            select: {
              name: true,
            },
          },
          tags: {
            select: {
              name: true,
            },
          },
          images: {
            select: {
              url: true,
            },
          },
          reviews: {
            select: {
              rating: true,
              description: true,
              date: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });

      response.json(product);
    } catch (error: any) {
      next(error);
    }
  };

  // //Crear
  // create = async (request: Request, response: Response, next: NextFunction) => {
  //     try {
  //     } catch (error) {
  //         next(error);
  //     }
  // };

  getWithPromotion = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const now = new Date();
      const products = await this.prisma.product.findMany({
       
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          price: true,
          averageRating: true,
          images: {
            select: { url: true },
            take: 1,
            orderBy: { id: "asc" }, // o "desc" para la última
          },
          promotions: {
            where: {
              startDate: { lte: now },
              endDate: { gte: now },
            },
                

          },
          category: {
            include: {
              promotions: {
                where: {
                  startDate: { lte: now },
                  endDate: { gte: now },
                },
              },
            },
          },
        },
      });
      response.json(products);
    } catch (error) {
      next(error);
    }
  };
}
