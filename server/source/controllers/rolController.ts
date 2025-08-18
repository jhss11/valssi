import { PrismaClient, Role } from "../../generated/prisma";;
import { Request, Response, NextFunction } from "express";

export class RolController {
  prisma = new PrismaClient();
  get = async (request: Request, response: Response, next: NextFunction) => {
    let listRoles = [];
    for (let element in Role) {
      switch (element) {
        case Role.ADMIN:
          listRoles.unshift({
            ["id"]: element,
            ["nombre"]: "Administrador",
          });
          break;
        case Role.USER:
          listRoles.unshift({
            ["id"]: element,
            ["nombre"]: "Usuario",
          });
          break;
        default:
          listRoles.unshift({ ["id"]: Role.USER, ["nombre"]: "Usuario" });
          break;
      }
    }

    response.json(listRoles);
  };
  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let id = request.params.id;
    let nombre = "";
    switch (Role[id as Role]) {
      case Role.ADMIN:
        nombre = "Administrador";
        break;
      case Role.USER:
        nombre = "Usuario";
        break;
      default:
        nombre = "Usuario";
        break;
    }
    let rol = { ["id"]: Role[id as Role], ["nombre"]: nombre };
    response.json(rol);
  };
}
