import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]

import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

import { CustomProductRoutingModule } from './custom-product-routing-module';
import { CustomProductForm } from './custom-product-form/custom-product-form';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CustomProductForm
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    TranslateModule,
    CustomProductRoutingModule
  ]
})
export class CustomProductModule { }
