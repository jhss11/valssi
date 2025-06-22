import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewRoutingModule } from './review-routing-module';
import { ReviewIndex } from './review-index/review-index';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReviewDetail } from './review-detail/review-detail';


@NgModule({
  declarations: [
    ReviewIndex,
    ReviewDetail
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReviewRoutingModule
  ]
})
export class ReviewModule { }
