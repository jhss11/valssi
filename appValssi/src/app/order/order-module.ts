import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing-module';
import { OrderIndex } from './order-index/order-index';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderDetail } from './order-detail/order-detail';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    OrderIndex,
    OrderDetail
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatTableModule,
    MatDividerModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
