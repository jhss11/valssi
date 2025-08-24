import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserIndex } from './user-index/user-index';
import { UserCreate } from './user-create/user-create';
import { UserLogin } from './user-login/user-login';
import { UserListado } from './user-listado/user-listado';
import { UserUpdate } from './user-update/user-update';

const routes: Routes = [
   {
    path: 'usuario',
    component: UserIndex,
    children: [
      { path: 'registrar', component: UserCreate },
      { path: 'login', component: UserLogin },
    ],
  },
  { path:'user',component: UserListado}, 
   { path: 'user/update/:id', component: UserUpdate },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
