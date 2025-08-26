import { Component, computed, inject, OnDestroy, OnInit, Signal } from '@angular/core';
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-order-cart',
  standalone: false,
  templateUrl: './order-cart.html',
  styleUrl: './order-cart.css',
  providers: [DatePipe]
})
export class OrderCart implements OnInit, OnDestroy {
  fecha = Date.now();
  userId = 5;
  username = '';
  email = '';
  form!: FormGroup;
  fechaFormateada = '';
  private destroy$ = new Subject<boolean>();

   //se pega esto en el ts y ya teniendo curretUser se usa para
    //ingresar a lo que trae el token (id, email, rol, username)
    authService = inject(AuthenticationService);
    isAuntenticated = this.authService.isAuthenticatedSignal;
    
    currentUser = this.authService.currentUserSignal;
    user = this.currentUser();


  private cartService = inject(CartService);

  // Items del carrito
  cartItems: Signal<ItemCartModel[]> = this.cartService.itemsCart;
  productItems: Signal<ItemCartModel[]> = computed(() =>
    this.cartItems().filter((item) => !item.customizations)
  );

  customItems: Signal<ItemCartModel[]> = computed(() =>
    this.cartItems().filter((item) => !!item.customizations)
  );
  totalCompra: Signal<number> = this.cartService.total;

  // Columnas de la tabla
  columnasProducto: string[] = [
    'name',
    'price',
    'quantity',
    'subtotal',
    'promotion',
    'total',
    'acciones',
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private userService: UserService,
    private noti: NotificationService,
    private router: Router,
    public translate: TranslateService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    // Se inicializa con el idioma del localStorage
    const lang = localStorage.getItem('lang') || 'es';
    this.formatearFecha(lang);

    // Cuando hay cambios de idioma
    this.translate.onLangChange.subscribe(event => {
      console.log("Idioma cambiado:", event.lang);
      this.formatearFecha(event.lang);
    });

    this.getUser(this.userId);

    this.form = this.fb.group({
      comment: [''], 
    });
  }

  private formatearFecha(lang: string) {
  this.fechaFormateada =
    this.datePipe.transform(this.fecha, 'longDate', undefined, lang) || '';
  console.log("Fecha formateada:", this.fechaFormateada);
}

  private getUser(id: number): void {
    this.userService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.username = data.username;
        this.email = data.email;
      });
  }

  cambiarCantidad(element: ItemCartModel, event: Event) {
    const input = event.target as HTMLInputElement;
    let nuevaCantidad = parseInt(input.value, 10);

    // Si el usuario no digita nada o si pone un valor menor a 0 siempre se pone como cantidad 1
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
      nuevaCantidad = 1; 
    }
    if (nuevaCantidad === 0) {
      this.eliminarItem(element.product.id, element.customizations);
      return;
    }

    this.cartService.addToCart(element.product, nuevaCantidad);
  }

  eliminarItem(productoId: number, customizations?: any) {
    this.cartService.removeFromCart(productoId, customizations);
  }

  getPromotions(item: any): string {
    const promos: string[] = [];

    const baseProduct = item?.customProduct?.baseProduct || item?.product;
    if (!baseProduct) return '0';

    const categoryPromos = baseProduct?.category?.promotions || [];
    const productPromos = baseProduct?.promotions || [];

    // Se recorren todas las promociones combinadas para saber si son aplicables en la fecha
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
      // Traduce el título de la notificación
    const titulo = this.translate.instant('order-cart.stockInsuficiente');

    // Genera la lista de productos sin stock
    const productosSinStock = sinStock
      .map((p) =>
        this.translate.instant('order-cart.stockMensaje', {
          nombre: p.name,
          disponible: p.available,
          solicitado: p.requested,
        })
      )
      .join('\n');

    this.noti.warning(titulo, productosSinStock, 3000);
    return false;
  }

  return true;
}

  crearOrden() {
  this.form.markAllAsTouched();

  const direccion = this.form?.get('comment')?.value?.trim();
  if (!direccion) {
    // Traducimos el título y el mensaje
    const titulo = this.translate.instant('order-cart.crearOrden');
    const mensaje = this.translate.instant('order-cart.ingresarDireccion');
    this.noti.warning(titulo, mensaje, 3000);
    return;
  }

  if (this.cartService.itemsCart().length > 0) {
    const valido = this.validarStockAntesDeComprar();
    if (!valido) return;

    const items: OrderItemModel[] = this.cartService.itemsCart().map(x => ({
      productId: x.product.id,
      quantity: x.quantity,
      price: x.product.price,
      customizations: x.customizations || null,
    }));

     const orderId = localStorage.getItem('orderId');


    const orden: OrderModel = {
      id:  orderId ? +orderId : 0,
      user: {} as UserModel,
      userId: this.currentUser()?.id,
      createdAt: new Date(),
      status: 'PENDING_PAYMENT' as OrderStatusModel,
      items,
      address: direccion,
      subtotal: this.cartService.total(),
      total: this.cartService.total() * 1.13,
      statusLogs: [],
    };


    if (orderId) {
      // Si existe, hacer update
      this.orderService.update( orden).subscribe((respuesta) => {

        this.cartService.deleteCart();
        const titulo = this.translate.instant('order-cart.crearOrden');
        const mensaje = this.translate.instant('order-cart.crearOrden', { id: respuesta.id });

        this.noti.success(titulo, mensaje, 3000, '/orders/pending');
      });
    } else {
      //Si no existe, crear nueva
      this.orderService.create(orden).subscribe((respuesta) => {

        this.cartService.deleteCart();

        const titulo = this.translate.instant('order-cart.crearOrden');
        const mensaje = this.translate.instant('order-cart.ordenCreada', { id: respuesta.id });

        this.noti.success(titulo, mensaje, 3000, '/orders/pending');
      });
    }
  } else {
    const titulo = this.translate.instant('order-cart.crearOrden');
    const mensaje = this.translate.instant('order-cart.agregarProductos');
    this.noti.warning(titulo, mensaje, 3000);
  }
}
  goBack(): void {
    this.router.navigate(['/product']);
  }
   ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
