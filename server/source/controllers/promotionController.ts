
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";
export class PromotionController {
    prisma = new PrismaClient();
    //Listado de videojuegos
    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            //Select * from videojuego
            const listado = await this.prisma.promotion.findMany({
                 include: {
    product: true,
    category: true,
     },
            })
            //Dar respuesta
            response.json(listado)
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
            let idPromotion = parseInt(request.params.id)
            if (isNaN(idPromotion)) {
                next(AppError.badRequest('El ID no es válido'))
            }
            const obj = await this.prisma.promotion.findFirst({
                where: { id: idPromotion },
                
            })
            if(obj){
                response.status(200).json(obj)
            }else{
                next(AppError.notFound('No existe el videojuego'))
            }

        } catch (error: any) {
            next(error)
        }
    };
    
    //Crear
    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
        } catch (error) {
            next(error);
        }
    };
    //Actualizar
    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
        } catch (error) {
            next(error);
        }
    };
}