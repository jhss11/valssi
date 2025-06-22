import { Router } from 'express';
import { ProductRoutes } from './product.routes';
import { ReviewRoutes } from './review.routes';
import { PromotiontRoutes } from './promotion.routes';
import { OrderRoutes } from './order.routes';
export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        // ----Agregar las rutas----
        router.use('/products', ProductRoutes.routes)
        router.use('/reviews', ReviewRoutes.routes)
        router.use('/promotion', PromotiontRoutes.routes)
        router.use('/orders', OrderRoutes.routes)

        return router;
    }
}
