import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]

import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CustomProductRoutingModule } from './custom-product-routing-module';
import { CustomProductForm } from './custom-product-form/custom-product-form';
import { TranslateModule } from '@ngx-translate/core';
import { UpdatePriceDiag } from './update-price-diag/update-price-diag';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    CustomProductForm,
    UpdatePriceDiag
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    CustomProductRoutingModule
  ]
})
export class CustomProductModule { }
