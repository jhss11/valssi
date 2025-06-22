import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing-module';
import { Inicio } from './inicio/inicio';
import { AboutUs } from './about-us/about-us';

import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    Inicio,
    AboutUs
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
