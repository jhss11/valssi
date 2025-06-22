import { Component } from '@angular/core';
import { NotificationService } from '../../share/notification-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../share/services/product.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  //Respuesta del API
  datos: any;
  imagenSeleccionada: string = '';

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private vjService:ProductService,
    private router:Router,
    private activeRoute:ActivatedRoute
  ) {
    let id=this.activeRoute.snapshot.paramMap.get('id')
    if(!isNaN(Number(id))) this.getProduct(Number(id))
    
  }
  getProduct(id: any) {
    this.vjService
      .getById(id)
      .pipe(takeUntil(this.destroy$)) // Operador de RxJS para desuscribirse automáticamente
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
        
        if (this.datos?.images?.length > 0) {
        this.imagenSeleccionada = 'http://localhost:3000/images/' + this.datos.images[0].url;
      } else {
        this.imagenSeleccionada = 'assets/image-not-found.png'; // imagen de respaldo opcional
      }
      });
  }
  goBack(): void {
    this.router.navigate(['/products/']);
  }
  //Hook del ciclo de vida de Angular: se ejecuta cuando el componente va a ser destruido
  ngOnDestroy() {
    this.destroy$.next(true); // Emite un valor para notificar a 'takeUntil'
    this.destroy$.unsubscribe(); // Completa el Subject 'destroy$' para liberar recursos
  }

  cambiarImagen(url: string): void {
    this.imagenSeleccionada = 'http://localhost:3000/images/' + url;
  }

  
}
