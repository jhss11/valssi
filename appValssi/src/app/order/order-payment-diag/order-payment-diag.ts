import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { OrderService } from '../../share/services/order.service';
import { OrderStatusModel } from '../../share/models/OrderStatusModel';
import { expiryDateValidator } from '../../share/expiry-date-validator';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-payment-diag',
  standalone: false,
  templateUrl: './order-payment-diag.html',
  styleUrls: ['./order-payment-diag.css'],
})
export class OrderPaymentDiag implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  paymentMethodSignal = signal<'CARD' | 'CASH'>('CARD');

  datosDialog: { id: number; total: number };
  paymentForm!: FormGroup;
  vuelto: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { id: number; total: number },
    private dialogRef: MatDialogRef<OrderPaymentDiag>,
    private pService: OrderService,
    private fb: FormBuilder,
    private noti: NotificationService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.datosDialog = data;
  }

  ngOnInit(): void {
    this.initForm();
    this.onPaymentTypeChanges();
    this.onCashChanges();
    this.applyValidators(this.paymentMethodSignal());
  }

  

  private initForm(): void {
    this.paymentForm = this.fb.group({
      paymentMethod: [this.paymentMethodSignal(), Validators.required],
      cardNumber: [null],
      expiryDate: [null],
      cvv: [null],
      cardHolder: [null],
      cashAmount: [null],
    });
  }

  private onPaymentTypeChanges(): void {
    this.paymentForm
      .get('paymentMethod')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val: 'CARD' | 'CASH') => {
        this.paymentMethodSignal.set(val);
        this.applyValidators(val);
      });
  }

  private applyValidators(type: 'CARD' | 'CASH'): void {
    if (type === 'CARD') {
      this.paymentForm
        .get('cardNumber')
        ?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      this.paymentForm
        .get('expiryDate')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
          expiryDateValidator(),
        ]);
      this.paymentForm
        .get('cvv')
        ?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
      this.paymentForm.get('cardHolder')?.setValidators([Validators.required]);
      this.paymentForm.get('cashAmount')?.clearValidators();
      this.vuelto = null;
    } else {
      this.paymentForm
        .get('cashAmount')
        ?.setValidators([
          Validators.required,
          Validators.min(this.datosDialog.total),
          Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
        ]);
      this.paymentForm.get('cardNumber')?.clearValidators();
      this.paymentForm.get('expiryDate')?.clearValidators();
      this.paymentForm.get('cvv')?.clearValidators();
      this.paymentForm.get('cardHolder')?.clearValidators();
    }

    Object.keys(this.paymentForm.controls).forEach((key) => {
      this.paymentForm.get(key)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private onCashChanges(): void {
    this.paymentForm
      .get('cashAmount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        this.vuelto = Number.isFinite(num)
          ? num - this.datosDialog.total
          : null;
      });
  }

  submitPayment(): void {
  this.paymentForm.markAllAsTouched();

  if (this.paymentForm.invalid) {
    const titulo = this.translate.instant('order-payment-diag.pagoInvalido');
    const mensaje = this.translate.instant('order-payment-diag.reviseDatos');
    this.noti.error(titulo, mensaje, 2000);
    return;
  }

  const body = {
    id: this.datosDialog.id,
    paymentMethod: this.paymentMethodSignal(),
    status: 'PAID' as OrderStatusModel,
  };

  this.pService.updatePaymentMethod(body)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        const titulo = this.translate.instant('order-payment-diag.pagoExito');
        const mensaje = this.translate.instant('order-payment-diag.pagoExitoMsg');
        this.noti.success(titulo, mensaje, 2000);
        this.dialogRef.close(true);
      },
      error: () => {
        const titulo = this.translate.instant('order-payment-diag.pagoError');
        const mensaje = this.translate.instant('order-payment-diag.pagoErrorMsg');
        this.noti.error(titulo, mensaje, 2000);
      }
    });
}


   errorHandling(controlName: string): string | false {
    const control = this.paymentForm.get(controlName);
    if (!control || !control.errors || !control.touched) return false;

    const firstErrorKey = Object.keys(control.errors)[0];

    return this.translate.instant(
      `order-payment-diag.validators.${controlName}.${firstErrorKey}`
    );
  }

  close(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
