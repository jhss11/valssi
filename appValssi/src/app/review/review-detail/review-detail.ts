import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ReviewService } from '../../share/services/review.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review-detail',
  standalone: false,
  templateUrl: './review-detail.html',
  styleUrl: './review-detail.css'
})
export class ReviewDetail {
 //Respuesta del API
  datos: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private vjService:ReviewService,
    private router:Router,
    private activeRoute:ActivatedRoute
  ) {
    let id=this.activeRoute.snapshot.paramMap.get('id')
    if(!isNaN(Number(id))) this.getReview(Number(id)) 
  }

  getReview(id: any) {
      this.vjService
        .getById(id)
        .pipe(takeUntil(this.destroy$)) // Operador de RxJS para desuscribirse automáticamente
        .subscribe((data: any) => {
          console.log(data);
          this.datos = data;
        });
    }
    goBack(): void {
      this.router.navigate(['/reviews/']);
    }
    //Hook del ciclo de vida de Angular: se ejecuta cuando el componente va a ser destruido
    ngOnDestroy() {
      this.destroy$.next(true); // Emite un valor para notificar a 'takeUntil'
      this.destroy$.unsubscribe(); // Completa el Subject 'destroy$' para liberar recursos
    }
}
