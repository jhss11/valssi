import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductIndex } from './product-index/product-index';
import { ProductDetail } from './product-detail/product-detail';

const routes: Routes = [
  {path:'product',component: ProductIndex},
  {path:'products/:id',component: ProductDetail}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
