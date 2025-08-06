// custom-product-form.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../share/notification-service';
import { Router, ActivatedRoute } from '@angular/router';
import { OptionValueService } from '../../share/services/option-value.service';
import { ProductService } from '../../share/services/product.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-custom-product-form',
  standalone: false,
  templateUrl: './custom-product-form.html',
  styleUrls: ['./custom-product-form.css'],
})
export class CustomProductForm implements OnInit, OnDestroy {
  datos: any;
  groupedOptions: { [key: string]: any[] } = {};
  selectedOptions: { [key: string]: any } = {};
  destroy$ = new Subject<void>();
  imagenSeleccionada = '';
  basePrice = 22000;

  imageMap: { [key: string]: string } = {
    Lila: 'color-lila.jpg',
    Verde: 'color-verde.png',
    'Grande': 'grande.jpg',
    'Peque': 'peque.jpg',
    'Cuadrados cosidos': 'cuadrados-cosidos.jpg',
    'Rayas horizontales': 'rayas.jpg',
  };

  constructor(
    private optionsService: OptionValueService,
    private noti: NotificationService,
    private router: Router,
    private prodService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) this.getProduct(id);
    this.getOptionsValues();
  }

  getProduct(id: number): void {
    this.prodService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.datos = data;
        if (data?.images?.length) {
          this.imagenSeleccionada =
            'http://localhost:3000/images/' + data.images[0].url;
        } else {
          this.imagenSeleccionada =
            'http://localhost:3000/images/image-not-found.png';
        }
      });
  }

  getOptionsValues(): void {
    this.optionsService.get().subscribe({
      next: (data) => {
        this.groupedOptions = {
          Color: data.filter((x: any) => x.optionId === 1),
          Tamano: data.filter((x: any) => x.optionId === 2),
          Diseno: data.filter((x: any) => x.optionId === 3),
        };
      },
      error: () => {
        this.noti.info('error', 'Error al cargar las opciones');
      },
    });
  }

  selectOption(category: string, option: any): void {
    this.selectedOptions[category] = option;
  }

  cambiarImagen(url: string): void {
    this.imagenSeleccionada = 'http://localhost:3000/images/' + url;
  }

  getTotal(): number {
    let total = this.basePrice;
    Object.values(this.selectedOptions).forEach((opt: any) => {
      if (opt?.price) total += opt.price;
    });
    return total;
  }

  getOptionImage(value: string): string {
    return `public/images/${this.imageMap[value] || 'image-not-found.png'}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
