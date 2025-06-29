import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../share/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  standalone: false,
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetail {
//Respuesta del API
  pedido: any;
  productItems: any[] = [];
  customItems: any[] = [];
 productDisplayedColumns: string[] = ['name', 'quantity', 'price', 'subtotal'];

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private vjService:OrderService,
    private router:Router,
    private activeRoute:ActivatedRoute
  ) {
    let id=this.activeRoute.snapshot.paramMap.get('id')
    if(!isNaN(Number(id))) this.getOrder(Number(id))
    
  }
  getOrder(id: number): void {
    this.vjService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.pedido = data;
        this.productItems = this.pedido.items?.filter((i: any) => i.product) || [];
        this.customItems = this.pedido.items?.filter((i: any) => i.customProduct) || [];
        console.log("Info", this.pedido);
      });
  }

  
  // getPromotions(item: any): string {
  //   const promos: string[] = [];
  //   const baseProduct = item?.customProduct?.baseProduct || item?.product;
  //   const categoryPromos = baseProduct?.category?.promotions || [];
  //   const productPromos = baseProduct?.promotions || [];

  //   [...productPromos, ...categoryPromos].forEach((p: any) => {
  //     const value = `${p.amount}${p.type === 'PERCENTAGE' ? '%' : ''}`;
  //     promos.push(value);
  //   });

  //   return promos.join(', ');
  // }
getPromotions(item: any): string {
  const promos: string[] = [];

  // Fecha cuando la orden cambió a PENDING_PAYMENT
  const pendingDateStr = this.pedido?.statusLogs?.[0]?.changedAt;
  if (!pendingDateStr) return '0';

  const pendingDate = new Date(pendingDateStr);

  const baseProduct = item?.customProduct?.baseProduct || item?.product;
  if (!baseProduct) return '0';

  const categoryPromos = baseProduct?.category?.promotions || [];
  const productPromos = baseProduct?.promotions || [];

  [...categoryPromos, ...productPromos].forEach((p: any) => {
    const startDate = new Date(p.startDate);
    const endDate = new Date(p.endDate);

    // Verifica si la promoción estaba vigente cuando la orden estaba en estado PENDING_PAYMENT
    if (pendingDate >= startDate && pendingDate <= endDate) {
      const value = `${p.amount}${p.type === 'PERCENTAGE' ? '%' : ''}`;
      promos.push(value);
    }
  });

  return promos.length > 0 ? promos.join(', ') : '0';
}

  goBack(): void {
    this.router.navigate(['/order/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
