import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class optionsValueController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
    
      const options = await this.prisma.customOptionValue.findMany({
      
      });
      response.json(options);
    } catch (error) {
      next(error);
    }
  };

    update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = request.body;

      // si viene un solo objeto se debe convetir en array
      const updates = Array.isArray(data) ? data : [data];

      const results = await Promise.all(
        updates.map(async (item) => {
          return this.prisma.customOptionValue.update({
            where: { id: item.id },
            data: { price: item.price },
          });
        })
      );

      response.json({
        message: "Opciones actualizadas correctamente",
        results,
      });
    } catch (error) {
      next(error);
    }
  };
}