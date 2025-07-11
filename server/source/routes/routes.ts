import { Router } from "express";
import { ProductRoutes } from "./product.routes";
import { ReviewRoutes } from "./review.routes";
import { PromotionRoutes } from "./promotion.routes";
import { OrderRoutes } from "./order.routes";
import { CategoryRoutes } from "./category.routes";
import { ImageRoutes } from "./image.routes";
export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    // ----Agregar las rutas----
    router.use("/products", ProductRoutes.routes);
    router.use("/reviews", ReviewRoutes.routes);
    router.use("/promotion", PromotionRoutes.routes);
    router.use("/orders", OrderRoutes.routes);
    router.use("/categories", CategoryRoutes.routes);
    router.use("/file/", ImageRoutes.routes);

    return router;
  }
}
