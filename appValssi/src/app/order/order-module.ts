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
import { TranslateModule } from '@ngx-translate/core';
import { OrderCart } from './order-cart/order-cart';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { OrderPendingPayment } from './order-pending-payment/order-pending-payment';
import { OrderPaymentDiag } from './order-payment-diag/order-payment-diag';
import { MatDialogContent } from '@angular/material/dialog';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatRadioButton } from '@angular/material/radio';

@NgModule({
  declarations: [
    OrderIndex,
    OrderDetail,
    OrderCart,
    OrderPendingPayment,
    OrderPaymentDiag
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatTableModule,
    MatDividerModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInputModule,
MatDialogContent,
MatSelect,
MatOption,
MatRadioButton,

    OrderRoutingModule
  ]
})
export class OrderModule { }
