import { Component, inject, Signal } from '@angular/core';
import { CartService } from '../../share/cart.service';
import { OrderItemModel } from '../../share/models/OrderItemModel';

@Component({
  selector: 'app-order-cart',
  standalone: false,
  templateUrl: './order-cart.html',
  styleUrl: './order-cart.css'
})
export class OrderCart {
  fecha = Date.now();

   private cartService = inject(CartService);
    //Lista de items de la compra
  //  private cartItemSignal: Signal<OrderItemModel[]>
   totalCompra: Signal<number> = this.cartService.total


}
