import { Component, computed, inject, Signal } from '@angular/core';
import { CartService } from '../../share/cart.service';
import { OrderItemModel } from '../../share/models/OrderItemModel';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../share/services/order.service';
import { NotificationService } from '../../share/notification-service';
import { ItemCartModel } from '../../share/models/ItemCartModel';
import { OrderModel } from '../../share/models/OrderModel';

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
  cartItems: Signal<ItemCartModel[]> =  this.cartService.itemsCart
  productItems: Signal<ItemCartModel[]>  = computed(() =>
  this.cartItems().filter(item => !item.customizations)
);
  // = this.cartService.itemsCart;

  customItems: Signal<ItemCartModel[]> = computed(() =>
  this.cartItems().filter(item => !!item.customizations)
);
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



cambiarCantidad(element: ItemCartModel, event: Event) {
  const input = event.target as HTMLInputElement;
  const valorTexto = input.value.trim();

  // Si está vacío, no hacemos nada todavía
  if (valorTexto === '') {
    return;
  }

  const valor = Number(valorTexto);

  if (isNaN(valor) || valor < 0) {
    // Si meten algo inválido, regresamos al valor original
    input.value = String(element.quantity);
    return;
  }

  if (valor === 0) {
    // Si ponen 0, eliminamos el producto
    this.eliminarItem(element.product.id);
  } else {
    // Si es positivo, actualizamos
    this.cartService.addToCart(element.product, valor);
  }
}


// ultimoValorValido: number = 1;

// cambiarCantidadInput(element: ItemCartModel, event: Event) {
//   // Solo actualizamos el valor en memoria, no cambiamos el input visual
//   const input = event.target as HTMLInputElement;
//   const valorTexto = input.value;

//   // Permitimos que el input quede vacío para que el usuario edite
//   if (valorTexto === '') {
//     // No hacer nada, dejamos que siga editando
//     return;
//   }

//   const valor = Number(valorTexto);
//   if (!isNaN(valor) && valor >= 0) {
//     // Guardamos el último valor válido para usarlo luego
//     this.ultimoValorValido = valor;
//   }
// }

// cambiarCantidadFinal(element: ItemCartModel, event: Event) {
//   const input = event.target as HTMLInputElement;
//   const valorTexto = input.value.trim();

//   if (valorTexto === '') {
//     // Si queda vacío, restauramos el último valor válido
//     input.value = String(this.ultimoValorValido);
//     return;
//   }

//   const valor = Number(valorTexto);

//   if (isNaN(valor) || valor < 0) {
//     // Valor inválido, restauramos el último válido
//     input.value = String(this.ultimoValorValido);
//     return;
//   }

//   if (valor === 0) {
//     this.eliminarItem(element.product.id);
//   } else {
//     // Actualizamos cantidad y guardamos como último valor válido
//     this.cartService.addToCart(element.product, valor);
//     this.ultimoValorValido = valor;
//   }
// }


  eliminarItem(productoId: number,customizations?: any) {
    this.cartService.removeFromCart(productoId, customizations);
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


    registrarOrden(){
    //Existan item en la compra
    if(this.cartService.itemsCart().length>0){
      //Detalle de la compra
      let detalle: OrderItemModel[]= this.cartService.itemsCart().map(
        (x: ItemCartModel)=>({
        productId: x.product.id,
        quantity: x.quantity,
        price: x.product.price
        //falta customizado
      } as  OrderItemModel
    ))
      //Encabezado de la compra del API
      let orden: OrderModel ={
        // createdA: new Date(this.fecha),
        userId: 1,
        // status: OrderStatusModel;
          address: "Mi casa",
          paymentMethod: "No hay",
          // subtotal: ;
          // total: number;
        items: detalle,
      } as OrderModel
      //Guardar Oden
      this.orderService.create(orden).subscribe((respuesta)=>{
        this.cartService.deleteCart()
        this.noti.success(
          'Crear Orden',
          'Orden creada #'+respuesta.id,
          3000,
          // '/orden-admin'
        )
      })
    }else{
      this.noti.warning('Crear Orden', 'Agregue productos a la orden',3000)
    }
  }


  goBack(): void {
    this.router.navigate(['/order/']);
  }
}
