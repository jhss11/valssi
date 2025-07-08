import { Component } from '@angular/core';
import { OrderService } from '../../share/services/order.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { OrderModel } from '../../share/models/OrderModel';

@Component({
  selector: 'app-order-index',
  standalone: false,
  templateUrl: './order-index.html',
  styleUrl: './order-index.css',
})
export class OrderIndex {
  //Respuesta del API
  datos: any;

  constructor(
    private vjService: OrderService,
    private noti: NotificationService,
    private router: Router
  ) {
    this.listOrders();
  }

  //Listar todos los videojuegos del API
  listOrders() {
    this.vjService.get().subscribe((respuesta: OrderModel[]) => {
      console.log('Respuesta cruda:', respuesta);

      this.datos = respuesta.map((pedido: any) => {
        if (
          pedido.statusLogs &&
          pedido.statusLogs.length > 0 &&
          pedido.statusLogs[0].changedAt
        ) {
          const originalDate = new Date(pedido.statusLogs[0].changedAt);
          const correctedDate = new Date(
            originalDate.getTime() + originalDate.getTimezoneOffset() * 60000
          );
          pedido.statusLogs[0].changedAt = correctedDate;
        }
        return pedido;
      });

      console.log('Fechas corregidas:', this.datos);
    });
  }

  // verDetalle(id: Number) {
  //   this.router.navigate(['/orders', id]);
  // }
}
