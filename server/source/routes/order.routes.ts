import { Router } from "express";
import { orderController } from "../controllers/orderController";

export class OrderRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new orderController();

    //localhost:3000/reviews/
    router.get("/", controller.get);
    router.get("/pending", controller.getByUserPendingP);


    router.get("/:id", controller.getById);
    
    router.post("/", controller.create);

    router.put("/", controller.updatePaymentMethod);


    return router;
  }
}
