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
          category: {
            select: { name: true },
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
}
