import { Component, inject } from '@angular/core';
import { ProductService } from '../../share/services/product.service';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from '../../share/models/ProductModel';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-product-index',
  standalone: false,
  templateUrl: './product-index.html',
  styleUrl: './product-index.css',
})
export class ProductIndex {
  //Respuesta del API
  datos: any;

  //se pega esto en el ts y ya teniendo curretUser se usa . para
  //ingresar a lo que trae el token (id, email, rol, username)
  authService = inject(AuthenticationService);
  isAuntenticated = this.authService.isAuthenticatedSignal;
  
  currentUser = this.authService.currentUserSignal;
  user = this.currentUser();

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


  cambiarEstado(item: ProductModel) {
  const nuevoEstado = !item.isDeleted; // invertir estado actual

  this.vjService.updateEstado({ id: item.id, isDeleted: nuevoEstado }).subscribe({
    next: (updated) => {
      item.isDeleted = updated.isDeleted; // reflejar cambio en UI
      const msg = item.isDeleted 
        ? this.noti.success('Producto desactivado', 'El producto fue desactivado', 2000)
        : this.noti.success('Producto reactivado', 'El producto fue reactivado', 2000);
    },
    error: () => {
      this.noti.error('Error', 'No se pudo actualizar el estado del producto', 2000);
    }
  });
}

  
}
