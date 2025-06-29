import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderIndex } from './order-index/order-index';
import { OrderDetail } from './order-detail/order-detail';

const routes: Routes = [
  {path:'order',component: OrderIndex},
    {path:'orders/:id',component: OrderDetail},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
