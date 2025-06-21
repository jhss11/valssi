import { Router } from "express";
import { ProductController } from "../controllers/productController";
export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ProductController();

    //localhost:3000/products/
    router.get("/", controller.get);

     //localhost:3000/products/2
    router.get('/:id', controller.getById)

    //localhost:3000/products/
    // router.get("/productWithPromotion", controller.getWithPromotion);

    return router;
  }
}
