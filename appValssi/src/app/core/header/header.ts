import { Component, effect, inject, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from '../../share/cart.service';
import { AuthenticationService } from '../../share/authentication.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UpdatePassword } from '../../user/update-password/update-password';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../share/services/order.service';
import { OrderStatusModel } from '../../share/models/OrderStatusModel';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private cartService = inject(CartService);
  qtyItems: Signal<Number> = this.cartService.qtyItems;

  //se pega esto en el ts y ya teniendo curretUser se usa . para
  //ingresar a lo que trae el token (id, email, rol, username)
  authService = inject(AuthenticationService);
  isAuntenticated = this.authService.isAuthenticatedSignal;

  currentUser = this.authService.currentUserSignal;
  user = this.currentUser();

  //username =this.currentUser.id

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private snackBar: MatSnackBar,
    private orderService: OrderService,
    private activeRouter: ActivatedRoute
  ) {
    effect(() => {
      const user = this.currentUser();
      console.log('Usuario actuallll:', user);
      if (user) {
        console.log('ID del usuario:', user.id);
      }
    });
    console.log('cantidad', this.qtyItems);
  }

  login(): void {
    this.router.navigate(['/usuario/login']);
  }

  logout() {
  if (this.cartService.itemsCart().length === 0) {
    this.finalizarLogout();
    return;
  }

  // Abrir snackbar con duración de 6000ms y color personalizado
  const snack = this.snackBar.open(
    '¿Desea guardar su carrito antes de salir?',
    'Guardar',
    {
      duration: 7000, 
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar'] 
    }
  );

  // Acción de "Guardar"
  snack.onAction().subscribe(() => {
    this.guardarCarritoAntesDeLogout();
  });

  // Si el snackbar se cierra sin acción -> descartar carrito
  snack.afterDismissed().subscribe((info) => {
    if (!info.dismissedByAction) {
      this.cartService.deleteCart();
      this.finalizarLogout();
    }
  });
}


  private guardarCarritoAntesDeLogout() {
    const userId = this.currentUser()?.id;
    if (!userId) {
      this.finalizarLogout();
      return;
    }

    const items = this.cartService.itemsCart().map((x) => ({
      productId: x.product.id,
      quantity: x.quantity,
      price: x.product.price,
      customizations: x.customizations || null,
    }));


     const orderId = localStorage.getItem('orderId');

    const orden = {
      id: orderId ? +orderId : 0,
      userId,
      createdAt: new Date(),
      status: 'CART' as OrderStatusModel,
      items,
      address: 'Carrito guardado temporalmente',
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

        // this.noti.success(titulo, mensaje, 3000, '/orders/pending');

        this.cartService.deleteCart();
      this.finalizarLogout();
      });
    } else {
      //Si no existe, crear nueva
      this.orderService.create(orden).subscribe((respuesta) => {

        this.cartService.deleteCart();

        const titulo = this.translate.instant('order-cart.crearOrden');
        const mensaje = this.translate.instant('order-cart.ordenCreada', { id: respuesta.id });

        // this.noti.success(titulo, mensaje, 3000, '/orders/pending');

         this.cartService.deleteCart();
          this.finalizarLogout();
      });
    }


    // this.orderService.create(orden).subscribe(() => {
    //   this.cartService.deleteCart();
    //   this.finalizarLogout();
    // });
  }

  private finalizarLogout() {
    this.authService.logout();
    this.router.navigate(['/usuario/login']);
  }

  cambiarIdioma(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  update() {
    this.router.navigate(['/user/update', this.currentUser()?.id]);
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(UpdatePassword, {
      width: '500px',
      height: '450px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Contraseña actualizada');
      }
    });
  }
}
