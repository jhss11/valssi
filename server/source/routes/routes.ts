import { Router } from "express";
import { ProductRoutes } from "./product.routes";
import { ReviewRoutes } from "./review.routes";
import { PromotionRoutes } from "./promotion.routes";
import { OrderRoutes } from "./order.routes";
import { CategoryRoutes } from "./category.routes";
import { ImageRoutes } from "./image.routes";
import { PromotionTypeRoutes } from './promoTypes.routes';
import { TagRoutes } from "./tag.routes";
import { OptionsRoutes } from "./option.routes";
import { UserRoutes } from "./user.routes";
import { OptionsValueRoutes} from "./optionsValue.routes";
import { customProductRoutes } from "./customProduct.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    // ----Agregar las rutas----
    router.use("/products", ProductRoutes.routes);
    router.use("/reviews", ReviewRoutes.routes);
    router.use("/promotion", PromotionRoutes.routes);
    router.use("/promotypes", PromotionTypeRoutes.routes)
    router.use("/orders", OrderRoutes.routes);
    router.use("/categories", CategoryRoutes.routes);
    router.use("/tag", TagRoutes.routes);
    router.use("/option", OptionsRoutes.routes);
    router.use("/optionsValues", OptionsValueRoutes.routes)
    router.use("/file/", ImageRoutes.routes);
    router.use("/users", UserRoutes.routes);
    router.use("/customProducts", customProductRoutes.routes);

    return router;
  }
}
