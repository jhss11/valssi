import { Router } from "express";
import { ReviewController } from "../controllers/reviewController";
export class ReviewRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ReviewController();

    //localhost:3000/reviews/
    router.get("/", controller.get);

     //localhost:3000/reviews/2
    router.get('/:id', controller.getById)

    //Crear
    router.post("/", controller.create);
    //Actualizar
   // router.put('/:id',controller.update)

    return router;
  }
}