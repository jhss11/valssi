import { Component } from '@angular/core';
import { OrderService } from '../../share/services/order.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { OrderModel } from '../../share/models/OrderModel';

@Component({
  selector: 'app-order-index',
  standalone: false,
  templateUrl: './order-index.html',
  styleUrl: './order-index.css'
})
export class OrderIndex {
//Respuesta del API
  datos: any;

constructor(private vjService:OrderService,
    private noti:NotificationService,
    private router:Router
  ) {   
    this.listOrders()
  }

  //Listar todos los videojuegos del API
  listOrders() {
    //localhost:3000/videojuego
    this.vjService.get().subscribe((respuesta: OrderModel[]) => {
      console.log(respuesta);
      this.datos = respuesta;
      
    });
  }

  verDetalle(id:Number) {
    this.router.navigate(['/orders',id])
  }

}
