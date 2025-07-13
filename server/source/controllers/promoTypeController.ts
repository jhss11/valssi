import { PrismaClient, PromoType } from "../../generated/prisma";;
import { Request, Response, NextFunction } from "express";

export class PromoTypeController {
  prisma = new PrismaClient();
  get = async (request: Request, response: Response, next: NextFunction) => {
    let listTypes = [];
    for (let element in PromoType) {
      switch (element) {
        case PromoType.FIXED:
          listTypes.unshift({
            ["id"]: element,
            ["name"]: "Monto fijo",
          });
          break;
        case PromoType.PERCENTAGE:
          listTypes.unshift({
            ["id"]: element,
            ["name"]: "Porcentaje",
          });
          break;
        default:
          listTypes.unshift({ ["id"]: PromoType.FIXED, ["name"]: "Monto fijo" });
          break;
      }
    }

    response.json(listTypes);
  };
  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let id = request.params.id;
    let nombre = "";
    switch (PromoType[id as PromoType]) {
      case PromoType.PERCENTAGE:
        nombre = "Porcentaje";
        break;
      case PromoType.FIXED:
        nombre = "Monto fijo";
        break;
      default:
        nombre = "Monto fijo";
        break;
    }
    let rol = { ["id"]: PromoType[id as PromoType], ["name"]: nombre };
    response.json(rol);
  };
}