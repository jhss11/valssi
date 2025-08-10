// custom-product-form.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NotificationService } from '../../share/notification-service';
import { Router, ActivatedRoute } from '@angular/router';
import { OptionValueService } from '../../share/services/option-value.service';
import { ProductService } from '../../share/services/product.service';
import { CustomProductService } from '../../share/services/custom-product.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductModel } from '../../share/models/ProductModel';
import { CartService } from '../../share/cart.service';

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

  private cartService = inject(CartService);

  imageMap: { [key: string]: string } = {
    Lila: 'color-lila.jpg',
    Verde: 'color-verde.png',
    '135cm x 200cm': 'grande.png',
    '52cm x 125cm': 'peque.png',
    'Cuadrados cosidos': 'cuadrados-cosidos.jpg',
    'Rayas horizontales': 'rayas.jpg',
  };

  constructor(
    private optionsService: OptionValueService,
    private noti: NotificationService,
    private router: Router,
    private prodService: ProductService,
    private customProd: CustomProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) this.getProduct(id);
    this.getOptionsValues();
  }

  private getProduct(id: number): void {
    this.prodService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.datos = data;

        console.log('images', this.datos.images);
        const nonCustomImages = data.images.filter((img) =>
          img.url.includes('edredon')
        );

        this.datos.images = nonCustomImages;
        console.log('sin personalizar', nonCustomImages);

        if (nonCustomImages?.length) {
          this.imagenSeleccionada =
            'http://localhost:3000/images/' + nonCustomImages[0].url;
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

  //Guarda la selección del usuario de cada criterio.
  selectOption(category: string, option: any): void {
    this.selectedOptions[category] = option;
  }

  cambiarImagen(url: string): void {
    this.imagenSeleccionada = 'http://localhost:3000/images/' + url;
  }

  //Se ejecuta cada que cambia algo en el componente
  getTotal(): number {
    let total = this.datos.price;
    Object.values(this.selectedOptions).forEach((opt: any) => {
      if (opt?.price) total += opt.price;
    });
    return total;
  }

  getOptionImage(value: string): string {
    const imageName = this.imageMap[value] || 'image-not-found.png';
    const fullPath = `http://localhost:3000/images/${imageName}`;
    return fullPath;
  }

  goBack(): void {
    this.router.navigate(['/product/4']);
  }

  comprar() {
    // Valida que cada criterio tenga una opción seleccionada
    const requiredCategories = ['Color', 'Tamano', 'Diseno'];
    const categoryLabels: { [key: string]: string } = {
      Color: 'Color',
      Tamano: 'Tamaño',
      Diseno: 'Diseño',
    };

    const missingCategories = requiredCategories.filter(
      (cat) => !this.selectedOptions[cat]
    );

    if (missingCategories.length > 0) {
      this.noti.error(
        'Faltan opciones',
        `Debes seleccionar: ${missingCategories
          .map((cat) => categoryLabels[cat])
          .join(', ')}`,
        3000
      );
      return;
    }

    // Si pasa la validación, construir el arreglo de opciones
    const selectedOptionsArray = Object.entries(this.selectedOptions).map(
      ([category, opt]: [string, any]) => ({
        optionName: category,
        optionValueId: opt.id,
        optionValueName: opt.value,
        optionPrice: opt.price,
      })
    );

    // Mensaje de éxito
    this.noti.success(
      'Compra',
      'Producto personalizado agregado al carrito',
      3000
    );

    // Agregar al carrito
    this.cartService.addToCart(this.datos, 1, {
      totalPrice: this.getTotal(),
      selectedOptions: selectedOptionsArray,
    });
  }

  // comprar(product: ProductModel) {
  //   console.log(product);
  //   this.noti.success('Compra', 'Producto comprado: ' + product.name, 3000);
  //   this.cartService.addToCart(product);
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //   comprar(): void {
  //   const payload= {
  //     baseProductId: this.datos.id,
  //     totalPrice: this.getTotal(),
  //     selections: Object.values(this.selectedOptions).map((opt: any) => ({
  //       optionValueId: opt.id
  //     }))
  //   };

  //   console.log('Payload:', payload);

  //   this.customProd.create(payload).subscribe({
  //     next: () => {
  //       this.noti.success('Compra', 'Producto personalizado creado', 3000);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.noti.error('Error', 'No se pudo crear el producto personalizado');
  //     }
  //   });
  // }
}
