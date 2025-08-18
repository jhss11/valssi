import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware'
import { Role } from '../../generated/prisma'


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
    router.post("/login", controller.login);
    router.post("/register", controller.register);
    router.get("/profile", authenticateJWT, controller.userAuth);
    //localhost:3000/promotion/2
    router.get("/:id", controller.getById);
    //Crear
  //  router.post("/", controller.create);
    //Actualizar
   // router.put('/:id',controller.update)

    return router;
  }
}