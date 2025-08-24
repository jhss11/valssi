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
      const listado = await this.prisma.user.findMany({});
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
      console.log("Payload recibido:", { username, email, password, role });

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
      async (
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

        try {
          // Actualizar último acceso
          const updatedUser = await this.prisma.user.update({
            where: { id: (user as any).id },
            data: { lastLogin: new Date() }, // Asegúrate de tener el campo en la DB
          });

          const token = generateToken(updatedUser as User);

          return res.json({
            success: true,
            message: "Inicio de sesión exitoso",
            token,
            user: updatedUser, // opcional: devolver usuario actualizado
          });
        } catch (error) {
          return next(error);
        }
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

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log('que diantres ')
      const idUser = parseInt(request.params.id);
      const body = request.body;

      // Verificar si existe el usuario
      const existingUser = await this.prisma.user.findUnique({
        where: { id: idUser },
      });

      if (!existingUser) {
        response.status(404).json({ message: "El usuario no existe" });
        return;
      }

      // Armar objeto de actualización
      const updateData: any = {};

      if (body.username) updateData.username = body.username;
      if (body.email) updateData.email = body.email;
      if (body.role) updateData.role = body.role;

      const updatedUser = await this.prisma.user.update({
        where: { id: idUser },
        data: updateData,
      });

      response.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("req.user:", req.user);
    if (!req.user) {
       res.status(401).json({ message: "Usuario no autenticado" });
    }

    console.log("req.body:", req.body);
    
    const { currentPassword, password, id } = req.body;
    
    // Validar que el ID esté presente
    if (!id) {
       res.status(400).json({ message: "ID de usuario requerido" });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
       res.status(404).json({ message: "Usuario no encontrado" });
       return
    }

    // Verificar que el usuario autenticado coincida con el ID proporcionado
    // (opcional pero recomendado para seguridad)
    

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validPassword) {
       res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await this.prisma.user.update({
      where: { id: Number(id) },
      data: { password: hash },
    });

    res.json({ success: true, message: "Contraseña actualizada" });
  } catch (error) {
    console.error("Error en updatePassword:", error);
    next(error);
  }
};
}
