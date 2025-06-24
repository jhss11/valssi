import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { PromotionRoutingModule } from './promotion-routing-module';
import { PromotionIndex } from './promotion-index/promotion-index';
import { PromotionDetail } from './promotion-detail/promotion-detail';


@NgModule({
  declarations: [
    PromotionIndex,
    PromotionDetail
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    PromotionRoutingModule
  ]
})
export class PromotionModule { }
