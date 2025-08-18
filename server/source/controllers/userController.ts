import { Request, Response, NextFunction, response } from "express";
import { AppError } from "../errors/custom.error";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, User } from "../../generated/prisma";
import passport from "passport";
import { generateToken } from "../config/authUtils";


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

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, role } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hash,
          role: Role[role as keyof typeof Role],
        },
      });

      res.status(201).json({
        success: true,
        message: "Usuario creado",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (
        err: Error | null,
        user: Express.User | false | null,
        info: { message?: string }
      ) => {
        if (err) return next(err);
        if (!user) {
          return res
            .status(401)
            .json({ success: false, message: info.message });
        }
        const token = generateToken(user as User);
        return res.json({
          success: true,
          message: "Inicio de sesión exitoso",
          token,
        });
      }
    )(req, res, next);
  };
  
  userAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuario = req.user as User;
      res.json(usuario);
    
   } catch (error) {
      next(error);
    }
  };

}
