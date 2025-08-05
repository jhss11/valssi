import { Router } from "express";
import { customProductController } from "../controllers/customProductController";

export class customProductRoutes {
  static get routes() {
    const router = Router();
    const controller = new customProductController();

   
    router.get("/", controller.get);
    router.post("/", controller.create);
 
    return router;
  }
}