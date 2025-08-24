import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
 { path: 'inicio', 
component: Inicio, 
canActivate: [authGuard], 
data: { roles: ['ADMIN','USER'] },
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
