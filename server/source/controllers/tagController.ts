import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class TagController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      // Obtener todos los tags ordenados alfabéticamente por nombre
      const tags = await this.prisma.tag.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      });
      response.json(tags);
    } catch (error) {
      next(error);
    }
  };

//Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener los datos json
      const body = request.body;

      const nueva = await this.prisma.tag.create({
        data: {
          name: body.name,
        },
      });
      response.status(201).json(nueva);
    } catch (error) {
      next(error);
    }
  };

  //Actualizar
  update = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const body = request.body;
    const id = parseInt(request.params.id);
    const updatedTag = await this.prisma.tag.update({
      where: { id: id },
      data: {
        name: body.name,
      },
    });

    response.json(updatedTag);
  } catch (error) {
    next(error);
  }
};


}



