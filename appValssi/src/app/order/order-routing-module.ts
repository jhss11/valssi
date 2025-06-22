import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderIndex } from './order-index/order-index';

const routes: Routes = [
  {path:'order',component: OrderIndex},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
