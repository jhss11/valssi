import { Router } from "express";
import { TagController } from "../controllers/tagController";

export class TagRoutes {
  static get routes() {
    const router = Router();
    const controller = new TagController();

    //localhost:3000/promotion/
    router.get("/", controller.get);
    //Crear
    router.post("/", controller.create);
    //Actualizar
    router.put('/:id',controller.update)
 
    return router;
  }
}
