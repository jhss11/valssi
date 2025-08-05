import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomProductForm } from './custom-product-form/custom-product-form';

const routes: Routes = [
  {path:'customProduct/:id',component: CustomProductForm},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomProductRoutingModule { }
