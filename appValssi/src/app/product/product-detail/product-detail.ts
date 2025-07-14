import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ProductService } from '../../share/services/product.service';
import { ReviewService } from '../../share/services/review.service';
// import { AuthService } from '../../share/services/auth.service';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';

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
  averageRating = 0;

  /* ---------- Reseñas ------------ */
  reviewForm!: FormGroup;
  userId = 3;            // ← usa AuthService.currentUserValue() en producción
  // userName = '';
  destroy$ = new Subject<void>();

  constructor(
    private prodService: ProductService,
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    // private auth: AuthService,
    private noti: NotificationService
  ) {}

  /* ---------------- Ciclo de vida ---------------- */
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) this.getProduct(id);

    /* // Datos del usuario autenticado
    const user = this.auth.currentUserValue();
    this.userId  = user.id;
    this.userName = user.name; */

    // Construir formulario de reseña
    this.reviewForm = this.fb.group({
      comment: [null, [Validators.required, Validators.minLength(3)]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  /* ---------------- Obtener producto ---------------- */
  private getProduct(id: number): void {
    this.prodService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.datos = data;
        this.averageRating = data?.averageRating ?? 0;

        if (data?.images?.length) {
          this.imagenSeleccionada =
            'http://localhost:3000/images/' + data.images[0].url;
        } else {
          this.imagenSeleccionada =
            'http://localhost:3000/images/image-not-found.png';
        }
      });
  }

  /* ---------------- Enviar reseña ---------------- */
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
        // Actualiza la lista local y promedio para feedback inmediato
        this.datos.reviews.unshift(created);
        this.recalculateAverage();
        this.reviewForm.reset();
        this.noti.success('¡Reseña registrada!', 'Gracias por tu aporte.', 2000);
      },
      error: (err) =>
        this.noti.error(
          'Error',
          err.message ?? 'No se pudo registrar la reseña'
        ),
    });
  }

  /* ---------------- Promedio local ---------------- */
  private recalculateAverage(): void {
    const sum = this.datos.reviews.reduce(
      (acc: number, r: any) => acc + r.rating,
      0
    );
    this.averageRating =
      Math.round((sum / this.datos.reviews.length) * 10) / 10;
  }

  /* ---------------- Auxiliares ---------------- */
  cambiarImagen(url: string): void {
    this.imagenSeleccionada = 'http://localhost:3000/images/' + url;
  }

  goBack(): void {
    this.router.navigate(['/product']);
  }

  errorHandling(control: string) {
    return getFormValidationErrorMessage(this.reviewForm, control);
  }

  get f() {
    return this.reviewForm.controls;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
