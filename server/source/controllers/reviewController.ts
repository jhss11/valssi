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

   //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = request.body;

    // Revisar si ya existe una reseña del mismo usuario para este producto
    const existente = await this.prisma.review.findFirst({
      where: {
        userId: Number(body.userId),
        productId: Number(body.productId),
      },
    });

    // if (existente) {
    //   return response.status(409).json({ message: 'Ya has enviado una reseña para este producto' });
    // }

    // Crear la reseña y actualizar el promedio en una transacción
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

      const avg = await tx.review.aggregate({
        where: { productId: Number(body.productId) },
        _avg: { rating: true },
      });

      await tx.product.update({
        where: { id: Number(body.productId) },
        data: { averageRating: avg._avg.rating ?? 0 },
      });

      return review;
    });

    response.status(201).json(nuevaReseña);
  } catch (error) {
    next(error);
  }
};

}
