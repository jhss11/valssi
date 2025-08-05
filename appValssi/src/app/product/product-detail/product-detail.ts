import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl,ValidatorFn} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ProductService } from '../../share/services/product.service';
import { UserService } from '../../share/services/user.service';
import { ReviewService } from '../../share/services/review.service';
// import { AuthService } from '../../share/services/auth.service';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { minWordsValidator } from '../../share/validators/min-words-validator';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit, OnDestroy {
  // Datos y estado de producto
  datos: any;
  imagenSeleccionada = '';

  reviewForm!: FormGroup;
  userId = 5;
  username = '';

  destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private prodService: ProductService,
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) this.getProduct(id);
    if (!isNaN(id)) this.getUser(this.userId);

    this.reviewForm = this.fb.group({
      comment: [null, [Validators.required, minWordsValidator(1)]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)],
      ], 
    });
  }

  private getProduct(id: number): void {
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

  /**
   * Gestiona el envío del formulario: Guarda la reseña
   */
  submitReview(): void {
    this.reviewForm.markAllAsTouched();
    if (this.reviewForm.invalid) {
      this.noti.error('Formulario inválido', 'Revise los campos requeridos.');
      return;
    }

    const payload = {
      userId: this.userId,
      productId: this.datos.id,
      description: this.reviewForm.value.comment,
      rating: this.reviewForm.value.rating,
      date: new Date(),
    };

    this.reviewService.create(payload).subscribe({
      next: (created) => {
        this.prodService.getById(this.datos.id).subscribe((updatedProduct) => {
          this.datos = updatedProduct; // llama al producto y trae los cambios
        });

        this.reviewForm.reset();
        this.noti.success(
          '¡Reseña registrada!',
          'Gracias por su aporte.',
          2000
        );
      },
      error: (err) =>
        this.noti.error(
          'Error',
          err.message ?? 'No se pudo registrar la reseña'
        ),
    });
  }

  cambiarImagen(url: string): void {
    this.imagenSeleccionada = 'http://localhost:3000/images/' + url;
  }

  goBack(): void {
    this.router.navigate(['/product/list']);
  }

  errorHandling(control: string) {
    return getFormValidationErrorMessage(this.reviewForm, control);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPromotion(item: any): any | null {
  if (item.promotions?.length > 0) {
    console.log('primer if', item.promotions?.length > 0)
    return item.promotions[0];
  }
  if (item.category?.promotions?.length > 0) {
    console.log('segundo if', item.category?.promotions?.length > 0)
    return item.category.promotions[0];
  }
  return null;
}

getDiscountedPrice(item: any): number {
  const promo = this.getPromotion(item);
  if (!promo) return item.price;

  if (promo.type === 'PERCENTAGE') {
    return item.price * (1 - promo.amount / 100);
  } else if (promo.type === 'FIXED') {
    return item.price - promo.amount;
  }
  return item.price;
}

private getUser(id: number): void {
    this.userService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.username = data.username;
      });
  }

   personalizar(id: Number) {
    this.router.navigate(['/customProduct', id]);
  }
}
