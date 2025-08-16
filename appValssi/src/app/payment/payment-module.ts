import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing-module';
import { PendingPayment } from './pending-payment/pending-payment';


@NgModule({
  declarations: [
    PendingPayment
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule
  ]
})
export class PaymentModule { }
