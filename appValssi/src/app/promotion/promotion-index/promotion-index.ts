import { Component } from '@angular/core';
import { PromotionService } from '../../share/services/promotion.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { PromotionModel } from '../../share/models/PromotionModel';
import { ActivatedRoute } from '@angular/router';

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
    private router:Router,
    private route: ActivatedRoute
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
  const hoy = new Date();
  const hoyString = this.toDateStringOnly(hoy);
  const inicioString = this.toDateStringOnly(new Date(startDate));
  const finString = this.toDateStringOnly(new Date(endDate));

  if (hoyString >= inicioString && hoyString <= finString) return 'Vigente';
  if (hoyString < inicioString) return 'Pendiente';
  return 'Aplicada';
}

//convierte la fecha a "YYYY-MM-DD"
toDateStringOnly(fecha: Date): string {
  return fecha.toISOString().split('T')[0];  // solo la parte de la fecha en formato ISO
}

getStatusColor(start: Date, end: Date): '#FF4D4D' | '#7ec1d6' | '#b8b2b2' {
  const hoy = new Date();
  const hoyStr = this.toDateStringOnly(hoy);
  const inicioStr = this.toDateStringOnly(new Date(start));
  const finStr = this.toDateStringOnly(new Date(end));

  if (hoyStr >= inicioStr && hoyStr <= finStr) return '#FF4D4D'; // vigente
  if (hoyStr < inicioStr) return '#7ec1d6'; // pendiente
  return '#b8b2b2'; // aplicada
}


getFechaEnEspanol(fecha: string | Date): string {
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: "short",
      year: 'numeric',
    };

    const fechaObj = new Date(fecha);
    fechaObj.setDate(fechaObj.getDate() + 1);
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  updatePromo(id: number) {
    this.router.navigate(['/promotion/update', id], {
      relativeTo: this.route,
    });
  }

  createPromo() {
    this.router.navigate(['/promotion/create'], {
      relativeTo: this.route,
    });
  }
}
