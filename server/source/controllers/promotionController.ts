import { Request, Response, NextFunction, response } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";
export class PromotionController {
  prisma = new PrismaClient();
  //Listado de prmos
  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Select * from promos
      const listado = await this.prisma.promotion.findMany({
        include: {
          product: true,
          category: true,
        },
      });
      //Dar respuesta
      response.json(listado);
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
      let idPromotion = parseInt(request.params.id);
      if (isNaN(idPromotion)) {
        next(AppError.badRequest("El ID no es válido"));
      }
      const obj = await this.prisma.promotion.findFirst({
        where: { id: idPromotion },
        include: {
          product: true,
          category: true,
        },
      });
      if (obj) {
        response.status(200).json(obj);
      } else {
        next(AppError.notFound("No existe el videojuego"));
      }
    } catch (error: any) {
      next(error);
    }
  };

  //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener los datos json
      const body = request.body;

      const nuevoVideojuego = await this.prisma.promotion.create({
        data: {
          name: body.name,
          type: body.type,
          amount: body.amount,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          product: body.productId
            ? { connect: { id: body.productId } }
            : undefined,
          category: body.categoryId
            ? { connect: { id: body.categoryId } }
            : undefined,
        },
      });
      response.status(201).json(nuevoVideojuego);
    } catch (error) {
      next(error);
    }
  };
  //Actualizar
  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;
      const idPromotion = parseInt(request.params.id);

      // Verificar existencia
      const existingPromotion = await this.prisma.promotion.findUnique({
        where: { id: idPromotion },
      });

      if (!existingPromotion) {
        response.status(404).json({ message: "El videojuego no existe" });
        return;
      }

      const updatedPromotion = await this.prisma.promotion.update({
        where: { id: idPromotion },
        data: {
          name: body.name,
          type: body.type,
          amount: body.amount,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          product: body.productId
            ? { connect: { id: body.productId } }
            : undefined,
          category: body.categoryId
            ? { connect: { id: body.categoryId } }
            : undefined,
        },
        include: {
          product: true,
          category: true,
        },
      });

      response.json(updatedPromotion);
    } catch (error) {
      next(error);
    }
  };
}
