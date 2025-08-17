import { Request, Response, NextFunction, response } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";
export class UserController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Select * from promos
      const listado = await this.prisma.user.findMany({
        
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
      let idUser = parseInt(request.params.id);
      if (isNaN(idUser)) {
        next(AppError.badRequest("El ID no es válido"));
      }
      const obj = await this.prisma.user.findFirst({
        where: { id: idUser },
        select:{
            username:true,
            email:true,

        }
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
}
