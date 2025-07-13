import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";
export class ReviewController {
  prisma = new PrismaClient();
  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las reseñas ordenadas por la fecha  de forma descendente
      const reviews = await this.prisma.review.findMany({
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          date: true,
          rating: true,
          product:{
            select:{name:true}
          },
          user: {
            select: { username: true },
          },
        },
      });
      response.json(reviews);
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
      const idReview = parseInt(request.params.id);

      const reviews = await this.prisma.review.findUnique({
        where: { id: idReview },
        select: {
          rating: true, 
          description: true, 
          date: true, 
          user: {
            select: {
              username: true, 
            },
          },
          product: {
            select: {
              name: true, 
            },
          },
        },
      });

      response.json(reviews);
    } catch (error: any) {
      next(error);
    }
  };
}
