import { Component } from '@angular/core';
import { OrderService } from '../../share/services/order.service';

@Component({
  selector: 'app-order-pending-payment',
  standalone: false,
  templateUrl: './order-pending-payment.html',
  styleUrl: './order-pending-payment.css'
})
export class OrderPendingPayment {
 pendingOrders: any[] = [];

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
}
