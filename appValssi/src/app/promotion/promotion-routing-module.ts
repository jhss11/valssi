import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionIndex } from './promotion-index/promotion-index';
import { PromotionDetail } from './promotion-detail/promotion-detail';

const routes: Routes = [
   {path:'promotion',component: PromotionIndex},
    {path:'promotion/:id',component: PromotionDetail}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
