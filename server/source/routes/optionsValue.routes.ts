import { Router } from "express";
import { optionsValueController } from "../controllers/optionsValueController";

export class OptionsValueRoutes {
  static get routes() {
    const router = Router();
    const controller = new optionsValueController();

    //localhost:3000/promotion/
    router.get("/", controller.get);
    router.put('/update',controller.update)
 
    return router;
  }
}