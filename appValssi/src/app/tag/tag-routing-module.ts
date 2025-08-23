import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagIndex } from './tag-index/tag-index';

const routes: Routes = [
     {path:'tag',component: TagIndex},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule { }
