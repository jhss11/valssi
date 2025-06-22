import { Component } from '@angular/core';
import { ReviewService } from '../../share/services/review.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { ReviewModel } from '../../share/models/ReviewModel';

@Component({
  selector: 'app-review-index',
  standalone: false,
  templateUrl: './review-index.html',
  styleUrl: './review-index.css',
})
export class ReviewIndex {
  //Respuesta del API
  datos: any;

  constructor(
    private vjService: ReviewService,
    private noti: NotificationService,
    private router: Router
  ) {
    this.listReviews();
  }

  //Listar todos las reseñas del API
  listReviews() {
    //localhost:3000/reviews
    this.vjService.get().subscribe((respuesta: ReviewModel[]) => {
      console.log(respuesta);
      this.datos = respuesta;
    });
  }

  verDetalle(id:Number){
    this.router.navigate(['reviews',id])
  }
}
