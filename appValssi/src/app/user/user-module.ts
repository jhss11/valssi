import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import {MatTabsModule} from '@angular/material/tabs';
import { UserRoutingModule } from './user-routing-module';
import { UserCreate } from './user-create/user-create';
import { UserLogin } from './user-login/user-login';
import { UserIndex } from './user-index/user-index';


@NgModule({
  declarations: [
    UserCreate,
    UserLogin,
    UserIndex
  ],
  imports: [
    CommonModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule,
  MatSelectModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
    UserRoutingModule
  ]
})
export class UserModule { }
