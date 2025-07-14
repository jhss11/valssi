import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ReviewService } from '../../share/services/review.service';
import { ProductService } from '../../share/services/product.service';
//import { AuthService } from '../../share/services/auth.service';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';



@Component({
  selector: 'app-review-form',
  standalone: false, // Se trabaja dentro de un módulo que ya importa ReactiveFormsModule & CommonModule
  templateUrl: './review-form.html',
  styleUrl: './review-form.css',
})
export class ReviewForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  /** Identificador del producto (viene de la ruta) */
  productId!: number;

  /** Datos del usuario autenticado (solo lectura en el UI) */
  userId!: number;
  userName = '';

  today = Date();
  /** Lista de reseñas para mostrar debajo del formulario */
  reviews: any[] = [];
  averageRating = 0;

  /** Formulario reactivo */
  reviewForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private productService: ProductService,
    //private authService: AuthService,
    private noti: NotificationService
  ) {}

  // -------------------------------------------------------------------------
  // Ciclo de vida
  // -------------------------------------------------------------------------
  ngOnInit(): void {
    //  Capturar ID del producto desde la ruta => /product/42
    this.route.params.subscribe((params: Params) => {
      this.productId = +params['id'];
      
    });

    //  Obtener datos del usuario autenticado
   // const user = this.authService.currentUserValue();
    this.userId = 3;
   // this.userName = user.name;

    //  Construir formulario reactivo
    this.reviewForm = this.fb.group({
      comment: [null, [Validators.required, Validators.minLength(3)]],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -------------------------------------------------------------------------
  // Carga inicial de reseñas
  // -------------------------------------------------------------------------
  
  // -------------------------------------------------------------------------
  // Enviar reseña
  // -------------------------------------------------------------------------
  submitReview(): void {
    this.reviewForm.markAllAsTouched();
    if (this.reviewForm.invalid) {
      this.noti.error('Formulario inválido', 'Revise los campos requeridos.');
      return;
    }

    const payload = {
      userId: this.userId,
      productId: this.productId,
      description: this.reviewForm.value.comment,
      rating: this.reviewForm.value.rating,
      date: new Date(),
    };

    this.reviewService.create(payload).subscribe({
      next: (created) => {
        // Insertar la reseña al inicio para feedback inmediato
        this.reviews.unshift(created);
        // Vaciar el formulario
        this.reviewForm.reset();
        // Recalcular promedio visual
        //this.calculateAverage();
        // Notificación
        this.noti.success('¡Reseña registrada!', 'Gracias por tu aporte.', 2000);
      },
      error: (err) =>
        this.noti.error(
          'Error',
          err.message ?? 'No se pudo registrar la reseña'
        ),
    });
  }

  // -------------------------------------------------------------------------
  // Promedio local (1 decimal)
  // -------------------------------------------------------------------------
  

  // -------------------------------------------------------------------------
  // Validación en la plantilla
  // -------------------------------------------------------------------------
  errorHandling(controlPath: string) {
    return getFormValidationErrorMessage(this.reviewForm, controlPath);
  }

  // Acceso fácil a controles en la plantilla
  get f() {
    return this.reviewForm.controls;
  }
}
