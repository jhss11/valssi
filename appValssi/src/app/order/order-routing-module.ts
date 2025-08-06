import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderIndex } from './order-index/order-index';
import { OrderDetail } from './order-detail/order-detail';
import { OrderCart } from './order-cart/order-cart';

const routes: Routes = [
  {path:'order',component: OrderIndex},
    {path:'orders/:id',component: OrderDetail},
    {path:'orderCart',component: OrderCart},

    
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
