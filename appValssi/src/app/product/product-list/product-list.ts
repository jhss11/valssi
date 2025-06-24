import { Component } from '@angular/core';
import { ProductModel } from '../../share/models/ProductModel';
import { ProductService } from '../../share/services/product.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  datos: any;

  constructor(private vjService:ProductService,
    private noti:NotificationService,
    private router:Router
  ) {   
    this.listProducts()
  }

  //Listar todos los videojuegos del API
  listProducts() {
    //localhost:3000/videojuego
    this.vjService.getMethod('promotions/active').subscribe((respuesta: ProductModel | ProductModel[]) => {
      console.log(respuesta);
      this.datos = respuesta;
      
    });
  }

  verDetalle(id:Number) {
    this.router.navigate(['/products',id])
  }
  getPromotion(item: any): any | null {
  if (item.promotions?.length > 0) {
    return item.promotions[0];
  }
  if (item.category?.promotions?.length > 0) {
    return item.category.promotions[0];
  }
  return null;
}

getDiscountedPrice(item: any): number {
  const promo = this.getPromotion(item);
  if (!promo) return item.price;

  if (promo.type === 'PERCENTAGE') {
    return item.price * (1 - promo.amount / 100);
  } else if (promo.type === 'FIXED') {
    return item.price - promo.amount;
  }
  return item.price;
}
}
