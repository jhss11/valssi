import { Component } from '@angular/core';
import { ProductService } from '../../share/services/product.service';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from '../../share/models/ProductModel';

@Component({
  selector: 'app-product-index',
  standalone: false,
  templateUrl: './product-index.html',
  styleUrl: './product-index.css',
})
export class ProductIndex {
  //Respuesta del API
  datos: any;

  constructor(
    private vjService: ProductService,
    private noti: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.listProducts();
  }

  //Listar todos los videojuegos del API
  listProducts() {
    //localhost:3000/videojuego
    this.vjService.get().subscribe((respuesta: ProductModel[]) => {
      console.log(respuesta);
      this.datos = respuesta;
    });
  }

  verDetalle(id: Number) {
    this.router.navigate(['/products', id]);
  }
  
  update(id: number) {
    this.router.navigate(['/product/update', id], {
      relativeTo: this.route,
    });
  }

  create() {
    this.router.navigate(['/product/create'], {
      relativeTo: this.route,
    });
  }

  
}
