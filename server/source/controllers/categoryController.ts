import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";
export class CategoryController {
  prisma = new PrismaClient();
  //Listado de categorias
  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Select * from categoría
      const listado = await this.prisma.category.findMany({
    
      });
      //Dar respuesta
      response.json(listado);
    } catch (error) {
      next(error);
    }
  };
}