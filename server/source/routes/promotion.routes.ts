import { Router } from "express";
import { PromotionController } from "../controllers/promotionController";
export class PromotiontRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new PromotionController();

    //localhost:3000/promotion/
    router.get("/", controller.get);

     //localhost:3000/promotion/2
    router.get('/:id', controller.getById)

    return router;
  }
}
