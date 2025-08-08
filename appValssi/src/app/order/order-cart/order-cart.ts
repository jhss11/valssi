import { Component, inject, Signal } from '@angular/core';
import { CartService } from '../../share/cart.service';
import { OrderItemModel } from '../../share/models/OrderItemModel';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../share/services/order.service';
import { NotificationService } from '../../share/notification-service';
import { ItemCartModel } from '../../share/models/ItemCartModel';

@Component({
  selector: 'app-order-cart',
  standalone: false,
  templateUrl: './order-cart.html',
  styleUrl: './order-cart.css',
})
export class OrderCart {
  fecha = Date.now();

  private cartService = inject(CartService);
  //Lista de items de la compra
  //  private cartItemSignal: Signal<OrderItemModel[]>
  // Items del carrito
  productItems: Signal<ItemCartModel[]> = this.cartService.itemsCart;
  totalCompra: Signal<number> = this.cartService.total;

  // DataSource para la tabla de Angular Material
  //  dataSource = new MatTableDataSource<ItemCartModel>([]);
  // Items del carrito
  // productItems: Signal<OrderItemModel[]> = this.cartService.itemsCart;

  // Columnas de la tabla
  columnasProducto: string[] = [
    'name',
    'quantity',
    'price',
    'subtotal',
    'promotion',
    'total',
    'acciones',
  ];

  constructor(
    private orderService: OrderService,
    private noti: NotificationService,
    private router: Router
  ) {
    // this.cartItemSignal=this.cartService.itemsCart
    // effect(()=>{
    //   // this.dataSource.data=this.cartItemSignal()
    // })
  }

  aumentarCantidad(element: ItemCartModel) {
    this.cartService.addToCart(element.product, element.quantity + 1);
  }
  disminuirCantidad(element: ItemCartModel) {
    this.cartService.addToCart(element.product, element.quantity - 1);
  }
  eliminarItem(productoId: number) {
    this.cartService.removeFromCart(productoId);
    // this.noti.info('Producto eliminado del carrito');
  }


getPromotions(item: any): string {
    const promos: string[] = [];


    const baseProduct = item?.customProduct?.baseProduct || item?.product;
    if (!baseProduct) return '0';

    const categoryPromos = baseProduct?.category?.promotions || [];
    const productPromos = baseProduct?.promotions || [];

    // Se recorren todas las promociones combinadas para sabe si son aplicables en la fecha
    [...categoryPromos, ...productPromos].forEach((p: any) => {
      const startDate = new Date(p.startDate);
      const endDate = new Date(p.endDate);

      if (new Date() >= startDate && new Date() <= endDate) {
        const value = `${p.amount}${p.type === 'PERCENTAGE' ? '%' : '₡'}`;
        promos.push(value);
      }
    });

    return promos.length > 0 ? promos.join(', ') : '0';
  }


  goBack(): void {
    this.router.navigate(['/order/']);
  }
}
