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
import { environment } from '../../../environments/environment.development';
import { UpdatePriceDiag } from '../update-price-diag/update-price-diag';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationService } from '../../share/authentication.service';

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

  //se pega esto en el ts y ya teniendo curretUser se usa . para
  //ingresar a lo que trae el token (id, email, rol, username)
  authService = inject(AuthenticationService);
  isAuntenticated = this.authService.isAuthenticatedSignal;

  currentUser = this.authService.currentUserSignal;
  user = this.currentUser();

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
    private dialog: MatDialog,
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
        console.log('imagen seleccionada quemado ', 'http://localhost:3000/images/' + nonCustomImages[0].url);
         console.log('imagen seleccionada apiurl', environment.apiURL +'/images/' + nonCustomImages[0].url);
        if (nonCustomImages?.length) {
          this.imagenSeleccionada =
           environment.apiURL +'/images/'+ nonCustomImages[0].url;
        } else {
          this.imagenSeleccionada =
            environment.apiURL +'/images/' + 'image-not-found.jpg';
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
    this.imagenSeleccionada = environment.apiURL +'/images/' + url;
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
    const imageName = this.imageMap[value] || 'image-not-found.jpg';
    const fullPath = environment.apiURL +'/images/'+imageName;
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
        name: category,
        optionValueId: opt.id,
        value: opt.value,
        price: opt.price,
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

abrirDialogoActualizarCostos(): void {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '600px';
  dialogConfig.height = '600px';
  dialogConfig.disableClose = false;
  dialogConfig.data = { options: this.groupedOptions }; // opcional, si quieres pasar datos

  const dialogRef = this.dialog.open(UpdatePriceDiag, dialogConfig);

  dialogRef.afterClosed().subscribe((updated: boolean) => {
    if (updated) {
      // Recargar opciones después de actualizar
      this.getOptionsValues();
    }
  });
}




  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
