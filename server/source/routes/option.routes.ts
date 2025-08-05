import { Router } from "express";
import { optionsController } from "../controllers/optionsController";

export class OptionsRoutes {
  static get routes() {
    const router = Router();
    const controller = new optionsController();

    //localhost:3000/promotion/
    router.get("/", controller.get);
 
    return router;
  }
}
