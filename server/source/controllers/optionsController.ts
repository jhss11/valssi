import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class optionsController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
    
      const options = await this.prisma.customOption.findMany({
      
      });
      response.json(options);
    } catch (error) {
      next(error);
    }
  };
}
