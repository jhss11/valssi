import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { OrderService } from '../../share/services/order.service';
// Si tu Angular es 16+ y quieres signals, puedes usar toSignal en vez de getter.

type PaymentKind = 'card' | 'cash';

@Component({
  selector: 'app-order-payment-diag',
  standalone: false,
  templateUrl: './order-payment-diag.html',
  styleUrls: ['./order-payment-diag.css'] // <- importante: styleUrls (en plural)
})
export class OrderPaymentDiag implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  // Lo que llega al diálogo
  // Espera algo como: { id: 123, total: 15000, defaultMethod?: 'card' | 'cash' }
  datosDialog: { id: number; total: number; defaultMethod?: PaymentKind };

  // Form + estado
  paymentForm!: FormGroup;
  vuelto: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { id: number; total: number; defaultMethod?: PaymentKind },
    private dialogRef: MatDialogRef<OrderPaymentDiag>,
    private pService: OrderService,
    private fb: FormBuilder,
    private noti: NotificationService,
    private router: Router
  ) {
    this.datosDialog = data;
  }

  ngOnInit(): void {
    this.initForm();            // crea el form con el método por defecto
    this.applyValidators();     // aplica validaciones iniciales según el método
    this.onPaymentTypeChanges();// re-aplica validaciones al cambiar método
    this.onCashChanges();       // calcula vuelto en vivo si es efectivo
  }

  // --------- Inicialización del formulario ----------
  private initForm(): void {
    const defaultMethod: PaymentKind = this.datosDialog.defaultMethod ?? 'card';

    this.paymentForm = this.fb.group({
      paymentType: [defaultMethod, Validators.required], // 'card' | 'cash'
      cardNumber: [null],
      expiryDate: [null],
      cvv: [null],
      cardHolder: [null],
      cashAmount: [null],
    });
  }

  // --------- Validaciones dinámicas ----------
  private onPaymentTypeChanges(): void {
    this.paymentForm.get('paymentType')!
      .valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyValidators();
      });
  }

  private applyValidators(): void {
    const type = this.paymentType; // getter de abajo

    if (type === 'card') {
      // Tarjeta
      this.paymentForm.get('cardNumber')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{16}$/),
      ]);
      this.paymentForm.get('expiryDate')?.setValidators([
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/), // MM/AA
      ]);
      this.paymentForm.get('cvv')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{3,4}$/),
      ]);
      this.paymentForm.get('cardHolder')?.setValidators([Validators.required]);

      // Limpia validaciones de efectivo
      this.paymentForm.get('cashAmount')?.clearValidators();
      this.vuelto = null;
    } else {
      // Efectivo
      this.paymentForm.get('cashAmount')?.setValidators([
        Validators.required,
        Validators.min(this.datosDialog.total),
        Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
      ]);

      // Limpia validaciones de tarjeta
      this.paymentForm.get('cardNumber')?.clearValidators();
      this.paymentForm.get('expiryDate')?.clearValidators();
      this.paymentForm.get('cvv')?.clearValidators();
      this.paymentForm.get('cardHolder')?.clearValidators();
    }

    // Actualiza estado de todos los controles
    Object.keys(this.paymentForm.controls).forEach((key) => {
      this.paymentForm.get(key)?.updateValueAndValidity();
    });
  }

  // Calcula vuelto cuando cambia el monto en efectivo
  private onCashChanges(): void {
    this.paymentForm.get('cashAmount')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        if (Number.isFinite(num)) {
          this.vuelto = num - this.datosDialog.total;
        } else {
          this.vuelto = null;
        }
      });
  }

  // --------- Submit ----------
  submitPayment(): void {
    this.paymentForm.markAllAsTouched();

    if (this.paymentForm.invalid) {
      this.noti.error('Pago inválido', 'Por favor revise los datos.', 5000);
      return;
    }

    const type: PaymentKind = this.paymentType;
// const status: 'PENDING_PAYMENT' as OrderStatusModel;
    // Aquí solo enviamos el tipo de pago al backend para el pedido específico
    // Ajusta el método según tu OrderService / API
    // Ejemplo con PATCH: PATCH /orders/:id/payment { paymentMethod: 'card' | 'cash' }
    // this.pService
    //   .updatePaymentMethod(this.datosDialog.id, { paymentMethod: type, status })
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: () => {
    //       if (type === 'cash') {
    //         this.noti.success('Pago en efectivo', `Pago exitoso. Vuelto: ₡${this.vuelto ?? 0}`, 4000, '/order');
    //       } else {
    //         this.noti.success('Pago con tarjeta', 'Pago exitoso. Pedido procesado.', 4000, '/order');
    //       }
    //       this.dialogRef.close(true); // cierra y avisa éxito al padre
    //     },
    //     error: (e) => {
    //       console.error(e);
    //       this.noti.error('Error', 'No se pudo procesar el pago', 5000);
    //     }
    //   });
  }

  // --------- Utilidades ----------
  errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.paymentForm, controlPath);
  }

  get paymentType(): PaymentKind {
    return this.paymentForm.get('paymentType')?.value as PaymentKind;
  }

  close(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
