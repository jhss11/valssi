import { Component, inject } from '@angular/core';
import { OrderService } from '../../share/services/order.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderPaymentDiag } from '../order-payment-diag/order-payment-diag';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-pending-payment',
  standalone: false,
  templateUrl: './order-pending-payment.html',
  styleUrl: './order-pending-payment.css',
  providers: [DatePipe],
})
export class OrderPendingPayment {
  pendingOrders: any[] = [];

  readonly dialog = inject(MatDialog);

  constructor(
    private orderService: OrderService,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadPendingOrders();
  }

  loadPendingOrders() {
    const userId = 5;

    this.orderService
      .getMethod(`pending?userId=${userId}`)
      .subscribe((respuesta: any | any[]) => {
        // Formateamos la fecha de cada orden según el idioma actual
        const lang = localStorage.getItem('lang') || 'es';
        this.pendingOrders = (respuesta || []).map((order: any) => ({
          ...order,
          fechaFormateada: this.formatDate(
            order.statusLogs[0]?.changedAt,
            lang
          ),
        }));
      });

    // Escuchar cambios de idioma
    this.translate.onLangChange.subscribe((event) => {
      this.pendingOrders = this.pendingOrders.map((order) => ({
        ...order,
        fechaFormateada: this.formatDate(
          order.statusLogs[0]?.changedAt,
          event.lang
        ),
      }));
    });
  }

  private formatDate(date: string | Date, lang: string): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'longDate', undefined, lang) || '';
  }

  pagar(id: number, total: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      id: id,
      total: total,
    };
    const dialogRef = this.dialog.open(OrderPaymentDiag, dialogConfig);

    dialogRef.afterClosed().subscribe((updated: boolean) => {
      if (updated) {
        this.loadPendingOrders();
      }
    });
  }
}
