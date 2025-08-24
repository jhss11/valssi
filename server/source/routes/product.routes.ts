import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware'
import { Role } from '../../generated/prisma' 
export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ProductController();

    //localhost:3000/products/
    router.get( 
      '/', 
      authenticateJWT,          
      authorizeRoles(Role.ADMIN, Role.USER), 
      controller.get 
    ); 

    //localhost:3000/products/summary
    router.get("/summary", controller.getProducts);

    //localhost:3000/products/2
    router.get("/:id", controller.getById);

    // router.get("/:id/stock", controller.getProductStock);
    router.put("/", controller.updateEstado);


    //localhost:3000/products/promotions/active/
    router.get("/promotions/active", controller.getWithPromotion);

    //Crear
    router.post("/", controller.create);
    
    //Actualizar
    router.put("/:id", controller.update);

    return router;
  }
}
