import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CartService } from '../../share/cart.service';
import { OrderItemModel } from '../../share/models/OrderItemModel';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../share/services/order.service';
import { NotificationService } from '../../share/notification-service';
import { ItemCartModel } from '../../share/models/ItemCartModel';
import { OrderModel } from '../../share/models/OrderModel';
import { OrderStatusModel } from '../../share/models/OrderStatusModel';
import { UserModel } from '../../share/models/UserModel';
import { UserService } from '../../share/services/user.service';

@Component({
  selector: 'app-order-cart',
  standalone: false,
  templateUrl: './order-cart.html',
  styleUrl: './order-cart.css',
})
export class OrderCart implements OnInit {
  fecha = Date.now();
  userId = 5;
  username = '';

  private cartService = inject(CartService);
  //Lista de items de la compra
  //  private cartItemSignal: Signal<OrderItemModel[]>
  // Items del carrito
  cartItems: Signal<ItemCartModel[]> = this.cartService.itemsCart;
  productItems: Signal<ItemCartModel[]> = computed(() =>
    this.cartItems().filter((item) => !item.customizations)
  );
  // = this.cartService.itemsCart;

  customItems: Signal<ItemCartModel[]> = computed(() =>
    this.cartItems().filter((item) => !!item.customizations)
  );
  totalCompra: Signal<number> = this.cartService.total;

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
    private userService: UserService,
    private noti: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser(this.userId);
  }

  private getUser(id: number): void {
    this.userService
      .getById(id)
      // .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.username = data.username;
      });
  }

  aumentarCantidad(element: ItemCartModel) {
    this.cartService.addToCart(element.product, element.quantity + 1);
  }

  disminuirCantidad(element: ItemCartModel) {
    this.cartService.addToCart(element.product, element.quantity - 1);
  }

  // cambiarCantidad(element: ItemCartModel, event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   const valorTexto = input.value.trim();

  //   // Si está vacío, no hacemos nada todavía
  //   if (valorTexto === '') {
  //     return;
  //   }

  //   const valor = Number(valorTexto);

  //   if (isNaN(valor) || valor < 0) {
  //     // Si meten algo inválido, regresamos al valor original
  //     input.value = String(element.quantity);
  //     return;
  //   }

  //   if (valor === 0) {
  //     // Si ponen 0, eliminamos el producto
  //     this.eliminarItem(element.product.id);
  //   } else {
  //     // Si es positivo, actualizamos
  //     this.cartService.addToCart(element.product, valor);
  //   }
  // }

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

  eliminarItem(productoId: number, customizations?: any) {
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

  validarStockAntesDeComprar(): boolean {
    const items = this.cartService.itemsCart().map((x) => ({
      product: x.product,
      quantity: x.quantity,
    }));

    const sinStock: { name: string; available: number; requested: number }[] =
      [];

    for (const item of items) {
      if (item.product.stock < item.quantity) {
        sinStock.push({
          name: item.product.name,
          available: item.product.stock,
          requested: item.quantity,
        });
      }
    }

    if (sinStock.length > 0) {
      const productosSinStock = sinStock.map((p) =>
            `${p.name} (Disponible: ${p.available}, Solicitado: ${p.requested})`).join('\n');
      this.noti.warning('Stock insuficiente', productosSinStock, 3000);
      return false;
    }

    return true;
  }

  crearOrden() {
    //VERIFICAR EL STOCK
    if (this.cartService.itemsCart().length > 0) {
      const valido = this.validarStockAntesDeComprar();
      console.log('Resultado validación stock:', valido);
      if (!valido) {
        // No hay stock suficiente, no continúa
        return;
      }
      // Mapeamos los ítems del carrito a OrderItemModel
      const items: OrderItemModel[] = this.cartService.itemsCart().map(
        (x: ItemCartModel) =>
          ({
            productId: x.product.id,
            quantity: x.quantity,
            price: x.product.price,
            customizations: x.customizations || null,
          } as OrderItemModel)
      );

      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      console.log(' Fecha guardar', new Date());
      console.log(' Fecha form', Date.now());

      // Creamos el objeto orden con valores iniciales válidos
      let orden: OrderModel = {
        id: 0,
        user: {} as UserModel,
        userId: this.userId, // Aquí pones el ID del usuario logueado
        createdAt: new Date(), // O lo maneja el backend
        status: 'PENDING_PAYMENT' as OrderStatusModel, // Estado inicial
        items,
        address: 'Dirección de ejemplo', // Desde formulario o sesión
        paymentMethod: 'Tarjeta', // Desde formulario
        subtotal: subtotal,
        total: this.cartService.total() * 1.13,
        statusLogs: [], // El backend puede llenarlo después
      } as OrderModel;

      this.orderService.create(orden).subscribe((respuesta) => {
        this.cartService.deleteCart();
        this.noti.success(
          'Crear Orden',
          'Orden creada #' + respuesta.id,
          3000,
          '/order'
        );
      });
    } else {
      this.noti.warning('Crear Orden', 'Agregue productos a la orden', 3000);
    }
  }

  goBack(): void {
    this.router.navigate(['/order/']);
  }
}
