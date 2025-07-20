import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductIndex } from './product-index/product-index';
import { ProductDetail } from './product-detail/product-detail';
import { ProductList } from './product-list/product-list';
import { ProductForm } from './product-form/product-form';

const routes: Routes = [
  {path:'product',component: ProductIndex},
  {path:'product/list',component: ProductList},
  {path:'product/create',component: ProductForm},
  {path:'product/update/:id',component: ProductForm},
  {path:'products/:id',component: ProductDetail},



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
