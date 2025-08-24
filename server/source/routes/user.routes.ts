import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware";
import { Role } from "../../generated/prisma";

export class UserRoutes {
  static get routes() {
    const router = Router();
    const controller = new UserController();

    //localhost:3000/promotion/
    //  router.get(
    //     "/",
    //     authenticateJWT,
    //     authorizeRoles(Role.ADMIN),
    //     controller.get
    //   );
    router.get("/", controller.get); 
    router.post("/login", controller.login); // login
    router.post("/register", controller.register);
    router.get("/profile", authenticateJWT, controller.userAuth);
    router.get("/:id", controller.getById);
    
router.put("/password", authenticateJWT,controller.updatePassword);
    //Crear
    //  router.post("/", controller.create);
    //Actualizar
    router.put('/:id',controller.update)
    

    return router;
  }
}
