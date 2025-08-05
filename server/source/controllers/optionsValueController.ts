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
}