import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicio } from './home/inicio/inicio';
import { PageNotFound } from './share/page-not-found/page-not-found';
import { UserIndex } from './user/user-index/user-index';
import { UserLogin } from './user/user-login/user-login';

const routes: Routes = [ 
{ path:'usuario',component: UserLogin}, 
{ path:'', redirectTo:'/usuario/login' ,pathMatch:'full'}, 
{path:'**', component:PageNotFound} 
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
