import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewIndex } from './review-index/review-index';
import { ReviewDetail } from './review-detail/review-detail';
import { ReviewForm } from './review-form/review-form';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
   //{path:'review',component: ReviewIndex},
{ 
path: 'review', 
component: ReviewIndex, 
canActivate: [authGuard], 
data: { roles: ['ADMIN'] }, 
},


   {path:'review/create/:id',component: ReviewForm},
   {path: 'review/update/:id', component: ReviewForm },
   {path:'reviews/:id',component: ReviewDetail}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRoutingModule { }
