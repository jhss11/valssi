import { Component } from '@angular/core';
import { PromotionService } from '../../share/services/promotion.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { PromotionModel } from '../../share/models/PromotionModel';

@Component({
  selector: 'app-promotion-index',
  standalone: false,
  templateUrl: './promotion-index.html',
  styleUrl: './promotion-index.css'
})
export class PromotionIndex {
//Respuesta del API
  datos: any;

  constructor(private vjService:PromotionService,
    private noti:NotificationService,
    private router:Router
  ) {   
    this.listPromotions()
  }

  listPromotions() {
    //localhost:3000/videojuego
    this.vjService.get().subscribe((respuesta: PromotionModel[]) => {
      console.log(respuesta);
      this.datos = respuesta;
      
    });
  }

  verDetalle(id:Number) {
    this.router.navigate(['/promotion',id])
  }

  getPromotionStatus(startDate: Date, endDate: Date): string {
  const now = new Date();
  if (now >= new Date(startDate) && now <= new Date(endDate)) {
    return 'Vigente';
  } else if (now < new Date(startDate)) {
    return 'Pendiente';
  } else {
    return 'Aplicada';
  }
}

getStatusColor(start: Date, end: Date): '#FF4D4D' | '#7ec1d6' | '#b8b2b2' {
  const now = new Date();
  if (now >= new Date(start) && now <= new Date(end)) return '#FF4D4D'; // vigente
  if (now < new Date(start)) return '#7ec1d6'; // pendiente
  return '#b8b2b2'; // finalizada
}
}
