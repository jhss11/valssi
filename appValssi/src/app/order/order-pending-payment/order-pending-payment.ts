import { Component, inject } from '@angular/core';
import { OrderService } from '../../share/services/order.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderPaymentDiag } from '../order-payment-diag/order-payment-diag';

@Component({
  selector: 'app-order-pending-payment',
  standalone: false,
  templateUrl: './order-pending-payment.html',
  styleUrl: './order-pending-payment.css'
})
export class OrderPendingPayment {
 pendingOrders: any[] = [];

  readonly dialog = inject(MatDialog);

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadPendingOrders();
  }

  loadPendingOrders() {
    const userId = 5; // reemplaza con el id real del usuario logueado


  this.orderService.getMethod(`pending?userId=${userId}`)
    .subscribe((respuesta: any | any[]) => {
      console.log(respuesta);
      // Asegurarse de que siempre sea un array
      this.pendingOrders = respuesta;
    });

  }

    pagar(id: number, total: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      id: id,
      total: total
    };
    const dialogRef = this.dialog.open(OrderPaymentDiag, dialogConfig);

  dialogRef.afterClosed().subscribe((updated: boolean) => {
    if (updated) {
      this.loadPendingOrders();
    }
  });
}
  
}
