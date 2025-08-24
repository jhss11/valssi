import { Component, effect, inject, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from '../../share/cart.service';
import { AuthenticationService } from '../../share/authentication.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UpdatePassword } from '../../user/update-password/update-password';
import { MatDialog } from '@angular/material/dialog';

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
    //
    this.authService.logout();
    this.router.navigate(['/usuario/login']);
  }

  cambiarIdioma(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  
  update() {
    this.router.navigate(['/user/update', this.currentUser()?.id])
  }


  openChangePasswordDialog() {
  const dialogRef = this.dialog.open(UpdatePassword, {
    width: '500px',
    height: '450px',
    data: {} 
  });


  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Contraseña actualizada');
    }
  });
}

}
