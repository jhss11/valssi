import { Component, inject, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from '../../share/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private cartService =inject(CartService)
  qtyItems: Signal<Number>=this.cartService.qtyItems;

  isAutenticated:boolean=false
  currentUser:any

  constructor(private translate: TranslateService) {
    this.currentUser={
      email:'jhasimarias@gmail.com'
    }
  
    console.log("cantidad", this.qtyItems)
  }

  cambiarIdioma(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
