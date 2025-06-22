import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewIndex } from './review-index/review-index';
import { ReviewDetail } from './review-detail/review-detail';

const routes: Routes = [
   {path:'review',component: ReviewIndex},
   {path:'reviews/:id',component: ReviewDetail}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }
