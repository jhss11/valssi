import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionIndex } from './promotion-index/promotion-index';
import { PromotionDetail } from './promotion-detail/promotion-detail';
import { PromotionForm } from './promotion-form/promotion-form';

const routes: Routes = [
   {path:'promotion',component: PromotionIndex},
   {path:'promotion/create',component: PromotionForm},
   { path: 'promotion/update/:id', component: PromotionForm },
   {path:'promotion/:id',component: PromotionDetail},
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
