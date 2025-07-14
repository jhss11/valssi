import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewRoutingModule } from './review-routing-module';
import { ReviewIndex } from './review-index/review-index';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReviewDetail } from './review-detail/review-detail';
import { ReviewForm } from './review-form/review-form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ReviewIndex,
    ReviewDetail,
    ReviewForm
  ],
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    ReviewRoutingModule
  ]
})
export class ReviewModule { }
