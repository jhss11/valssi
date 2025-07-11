import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductIndex } from './product-index/product-index';
import { ProductDetail } from './product-detail/product-detail';
import { ProductList } from './product-list/product-list';
import { ProductForm } from './product-form/product-form';

const routes: Routes = [
  {path:'product',component: ProductIndex},
  {path:'products/:id',component: ProductDetail},
  {path:'product/list',component: ProductList},
  {path:'product/crear',component: ProductForm}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
