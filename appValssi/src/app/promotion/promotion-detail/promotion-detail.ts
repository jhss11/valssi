import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PromotionService } from '../../share/services/promotion.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-promotion-detail',
  standalone: false,
  templateUrl: './promotion-detail.html',
  styleUrl: './promotion-detail.css'
})
export class PromotionDetail {
 promo: any;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private vjService:PromotionService,
    private router:Router,
    private activeRoute:ActivatedRoute
  ) {
    let id=this.activeRoute.snapshot.paramMap.get('id')
    if(!isNaN(Number(id))) this.getPromotion(Number(id))
    
  }
  getPromotion(id: any) {
    this.vjService
      .getById(id)
      .pipe(takeUntil(this.destroy$)) // Operador de RxJS para desuscribirse automáticamente
      .subscribe((data: any) => {
        console.log(data);
        this.promo = data;
      });
  }
  goBack(): void {
    this.router.navigate(['/promotion/']);
  }
  //Hook del ciclo de vida de Angular: se ejecuta cuando el componente va a ser destruido
  ngOnDestroy() {
    this.destroy$.next(true); // Emite un valor para notificar a 'takeUntil'
    this.destroy$.unsubscribe(); // Completa el Subject 'destroy$' para liberar recursos
  }
  getPromotionStatus(start: Date, end: Date): string {
  const now = new Date();
  if (now >= new Date(start) && now <= new Date(end)) return 'Vigente';
  if (now < new Date(start)) return 'Pendiente';
  return 'Aplicada';
}

getStatusColor(start: Date, end: Date): '#FF4D4D' | '#7ec1d6' | '#D3D3D3' {
  const now = new Date();
  if (now >= new Date(start) && now <= new Date(end)) return '#FF4D4D'; // vigente
  if (now < new Date(start)) return '#7ec1d6'; // pendiente
  return '#D3D3D3'; // finalizada
}
getFechaEnEspanol(fecha: string | Date): string {
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: "long",
      year: 'numeric',
    };

    const fechaObj = new Date(fecha);
    fechaObj.setDate(fechaObj.getDate() + 1);
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

}
