import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CategoryController();

    //localhost:3000/category/
    router.get("/", controller.get);

    //  //localhost:3000/promotion/2
    // router.get('/:id', controller.getById)

    return router;
  }
}
