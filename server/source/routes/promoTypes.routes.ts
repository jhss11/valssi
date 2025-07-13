import { Router } from 'express'
import { PromoTypeController } from '../controllers/promoTypeController'


export class PromotionTypeRoutes {
    static get routes(): Router {
        const router= Router()
        const controller=new PromoTypeController()
        
        router.get('/',controller.get)
        router.get('/:id',controller.getById)
        return router
    }


}