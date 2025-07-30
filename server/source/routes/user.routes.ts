import { Router } from "express";
import { UserController } from "../controllers/userController";

export class UserRoutes {
  static get routes() {
    const router = Router();
    const controller = new UserController();

    //localhost:3000/promotion/
    router.get("/", controller.get);
    //localhost:3000/promotion/2
    router.get("/:id", controller.getById);
    //Crear
  //  router.post("/", controller.create);
    //Actualizar
   // router.put('/:id',controller.update)

    return router;
  }
}