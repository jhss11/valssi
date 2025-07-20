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
          product: {
            select: { name: true },
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

  //Create
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener los datos json
      const body = request.body;

      // Crea la reseña y actualiza el promedio en una transacción
      const nuevaReseña = await this.prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
          data: {
            rating: body.rating,
            description: body.description,
            date: body.date ? new Date(body.date) : undefined,
            user: { connect: { id: Number(body.userId) } },
            product: { connect: { id: Number(body.productId) } },
          },
          select: {
            rating: true,
            description: true,
            date: true,
            user: { select: { username: true } },
            product: { select: { name: true } },
          },
        });

        //Función de Prisma para operaciones count, avg, sum etc
        const avg = await tx.review.aggregate({
          where: { productId: Number(body.productId) },
          _avg: { rating: true }, //Calcula el promedio del campo rating de un prod específico
        });
        /**{
            _avg: {
               rating: 4.0
                  }
            } */
        await tx.product.update({
          where: { id: Number(body.productId) },
          data: { averageRating: avg._avg.rating ?? 0 },
        });

        return {
          ...review,
          averageRating: avg._avg.rating ?? 0,
        };
      });

      response.status(201).json(nuevaReseña);
    } catch (error) {
      next(error);
    }
  };

  //Update
  // update = async (request: Request, response: Response, next: NextFunction) => {
  //   try {
  //     //Obtener los datos json
  //     const body = request.body;
  //     const idReview = parseInt(request.params.id);

  //     // Verificar existencia
  //     const existingPromotion = await this.prisma.review.findUnique({
  //       where: { id: idReview },
  //     });

  //     if (!existingPromotion) {
  //       response.status(404).json({ message: "La reseña no existe" });
  //       return;
  //     }

  //     // Edita la reseña y actualiza el promedio en una transacción
  //     const nuevaReseña = await this.prisma.$transaction(async (tx) => {
  //       const review = await tx.review.update({
  //         where: { id: idReview },
  //         data: {
  //           rating: body.rating,
  //           description: body.description,
  //           date: body.date ? new Date(body.date) : undefined,
  //           user: { connect: { id: Number(body.userId) } },
  //           product: { connect: { id: Number(body.productId) } },
  //         },
  //         select: {
  //           rating: true,
  //           description: true,
  //           date: true,
  //           user: { select: { username: true } },
  //           product: { select: { name: true } },
  //         },
  //       });

  //       //Función de Prisma para operaciones count, avg, sum etc
  //       const avg = await tx.review.aggregate({
  //         where: { productId: Number(body.productId) },
  //         _avg: { rating: true }, //Calcula el promedio del campo rating de un prod específico
  //       });
  //       /**{
  //           _avg: {
  //              rating: 4.0
  //                 }
  //           } */
  //       await tx.product.update({
  //         where: { id: Number(body.productId) },
  //         data: { averageRating: avg._avg.rating ?? 0 },
  //       });

  //       return review;
  //     });

  //     response.status(201).json(nuevaReseña);
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
