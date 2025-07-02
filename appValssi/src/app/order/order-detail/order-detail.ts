import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../share/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  standalone: false,
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail {
  //Respuesta del API
  pedido: any;
  productItems: any[] = [];
  customItems: any[] = [];
  productDisplayedColumns: string[] = [
    'name',
    'quantity',
    'price',
    'subtotal',
    'promotion',
    'total',
  ];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private vjService: OrderService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    let id = this.activeRoute.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) this.getOrder(Number(id));
  }

  getOrder(id: number): void {
    this.vjService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
      this.pedido = {
        ...data,
        fechaFormateada: data.statusLogs?.[0]?.changedAt
          ? this.formatoFecha(data.statusLogs[0].changedAt)
          : '',
      };
        this.productItems =
          this.pedido.items?.filter((i: any) => i.product) || [];
        this.customItems =
          this.pedido.items?.filter((i: any) => i.customProduct) || [];
        console.log('Pedido Info', this.pedido);
      });
  }

  formatoFecha(date:string | Date): string{
      const originalDate = new Date(date);
    const correctedDate = new Date(originalDate.getTime() + originalDate.getTimezoneOffset() * 60000);
    return new Intl.DateTimeFormat('es-CR',{
      weekday: 'short',
      day: '2-digit',
      month:'short',
      year:'numeric'
    })
    .format(correctedDate)
    .replace("",'')
  }


  getPromotions(item: any): string {
    const promos: string[] = [];

    // Fecha cuando la orden cambió a PENDING_PAYMENT que es el primer estado después de CART
    const pendingDateStr = this.pedido?.statusLogs?.[0]?.changedAt;
    if (!pendingDateStr) return '0';

    const pendingDate = new Date(pendingDateStr);

    const baseProduct = item?.customProduct?.baseProduct || item?.product;
    if (!baseProduct) return '0';

    const categoryPromos = baseProduct?.category?.promotions || [];
    const productPromos = baseProduct?.promotions || [];

    // Se recorren todas las promociones combinadas para sabe si son aplicables en la fecha
    [...categoryPromos, ...productPromos].forEach((p: any) => {
      const startDate = new Date(p.startDate);
      const endDate = new Date(p.endDate);

      // Verifica si la promoción estaba vigente cuando la orden estaba en estado PENDING_PAYMENT
      if (pendingDate >= startDate && pendingDate <= endDate) {
        const value = `${p.amount}${p.type === 'PERCENTAGE' ? '%' : '₡'}`;
        promos.push(value);
      }
    });

    return promos.length > 0 ? promos.join(', ') : '0';
  }

  //Aquí obtengo el valor total aplicando las promociones
  getTotalWithPromotion(item: any): number {
    const quantity = item.quantity || 1;

    // Determinar si es un producto personalizado porque el precio total del producto es distinto
    const isCustom = !!item.customProduct;

    const basePrice = isCustom
      ? item.customProduct?.totalPrice || 0
      : item.price || 0;

    let discountTotal = 0;

    // Verificar las fechas de las promos
    const pendingDateStr = this.pedido?.statusLogs?.[0]?.changedAt;
    if (!pendingDateStr) return quantity * basePrice;

    const pendingDate = new Date(pendingDateStr);

    const baseProduct = isCustom
      ? item.customProduct.baseProduct
      : item.product;
    if (!baseProduct) return quantity * basePrice;

    const categoryPromos = baseProduct?.category?.promotions || [];
    const productPromos = baseProduct?.promotions || [];

    [...categoryPromos, ...productPromos].forEach((p: any) => {
      const startDate = new Date(p.startDate);
      const endDate = new Date(p.endDate);
      if (pendingDate >= startDate && pendingDate <= endDate) {
        if (p.type === 'PERCENTAGE') {
          discountTotal += (basePrice * p.amount) / 100;
        } else {
          discountTotal += p.amount;
        }
      }
    });

    //Aplica el total de todos los descuentos
    const discountedPrice = basePrice - discountTotal;
    return quantity * Math.max(discountedPrice, 0);
  }

  goBack(): void {
    this.router.navigate(['/order/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
