import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl,ValidatorFn} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ProductService } from '../../share/services/product.service';
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
  userId = 3;

  destroy$ = new Subject<void>();

  constructor(
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

}
