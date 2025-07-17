import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CategoryService } from '../../share/services/category.service';
import { ProductService } from '../../share/services/product.service';
import { PromoTypeService } from '../../share/services/promo-type.service';
import { PromotionService } from '../../share/services/promotion.service';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';

@Component({
  selector: 'app-promotion-form',
  standalone: false,
  templateUrl: './promotion-form.html',
  styleUrl: './promotion-form.css',
})
export class PromotionForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  titleForm = 'Crear';
  idPromotion: number | null = null;
  isCreate = true;

  promoTypes: any[] = [];
  categories: any[] = [];
  products: any[] = [];

  promotionForm!: FormGroup;
  number4digits = /^\d{4}$/;
  number2decimals = /^[0-9]+[.,]{1,1}[0-9]{2,2}$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private promoTypeService: PromoTypeService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private promotionService: PromotionService,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPromoTypes();
    this.loadCategories();
    this.loadProducts();

    // Si llega un id es update
    this.route.params.subscribe((params: Params) => {
      this.idPromotion = params['id'];
      this.isCreate = this.idPromotion === undefined;
      this.titleForm = this.isCreate ? 'Crear' : 'Actualizar';

      //Si no es verdadero (es falso), entonces es para actualizar
      if (!this.isCreate) {
        this.promotionService
          .getById(this.idPromotion!)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            //Cargar los valores en el formulario
            this.patchFormValues(data);
          });
      }
    });
  }

  /**
   * Inicializar el formulario reactivo
   */
  private initForm(): void {
    this.promotionForm = this.fb.group(
      {
        id: [null],
        name: [null, [Validators.required, Validators.minLength(3)]],
        type: [null, [Validators.required]],
        amount: [null, [Validators.required, Validators.min(0.01)]],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        categoryId: [null],
        productId: [null],
        // Campo local para saber a quién aplica la promo
        applyTo: ['CATEGORY', Validators.required], // 'CATEGORY' | 'PRODUCT'
      },
      { validators: [this.targetValidator(), this.dateRangeValidator()] }
    );

    //Limpia el otro campo cuando cambia el applyto
    this.promotionForm
      .get('applyTo')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === 'CATEGORY') {
          this.promotionForm.get('productId')!.reset();
        } else {
          this.promotionForm.get('categoryId')!.reset();
        }
      });
  }

  //Lista fixed o percentage
  private loadPromoTypes(): void {
    this.promoTypeService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.promoTypes = data));
  }

  //Lista categorias
  private loadCategories(): void {
    this.categoryService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.categories = data));
  }

  //Lista productos
  private loadProducts(): void {
    this.productService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.products = data));
  }

  // Fecha en formato 2025-07-12, para mostrar en los inputs de fecha
  private toDateInput(date: string | Date | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    const fecha = new Date(d.getTime()).toISOString().slice(0, 10);
    console.log('método ',fecha)
    return fecha 
  }

  /**
   * Carga en el formulario la promo existente para actualizar.
   * @param data El objecto de respuesta del API.
   */
  private patchFormValues(data: any): void {
    this.promotionForm.patchValue({
      id: data.id,
      name: data.name,
      type: data.type,
      amount: data.amount,
      startDate: this.toDateInput(data.startDate),
      endDate: this.toDateInput(data.endDate),
      categoryId: data.categoryId,
      productId: data.productId,
      //Si tiene categoryId se sabe que tiene relación con categoría, sino, es con producto
      applyTo: data.categoryId ? 'CATEGORY' : 'PRODUCT',
    });
    console.log('editar ',data.startDate)
  }

  /**
   * Gestiona el envío del formulario: Guarda/actualiza la promo
   */
  submitPromotion(): void {
    this.promotionForm.markAllAsTouched(); // Marcar todos los controles como touched para mostrar mensajes de validación
    if (this.promotionForm.invalid) {
      this.noti.error('Formulario inválido', 'Revise los campos requeridos.');
      return;
    }

    const f = this.promotionForm.value;

    // Transforma los valores del formulario para que coincidan con la estructura en el API
    const payload = {
      id: f.id,
      name: f.name,
      type: f.type,
      amount: f.amount,
      startDate: new Date(f.startDate),
      endDate: new Date(f.endDate),
      productId: f.applyTo === 'PRODUCT' ? f.productId : null,
      categoryId: f.applyTo === 'CATEGORY' ? f.categoryId : null,
    };

    //Crea o actualiza según isCreate
    if (this.isCreate) {
      this.promotionService.create(payload).subscribe({
        next: (data) =>
          this.noti.success(
            'Promoción creada',
            `Nombre: ${data.name}`,
            2500,
            '/promotion'
          ),
        error: (err) =>
          this.noti.error(
            'Error',
            err.message ?? 'No se pudo crear la promoción'
          ),
      });
    } else {
      this.promotionService.update(payload).subscribe({
        next: (data) =>
          this.noti.success(
            'Promoción actualizada',
            `Nombre: ${data.name}`,
            2500,
            '/promotion'
          ),
        error: (err) =>
          this.noti.error(
            'Error',
            err.message ?? 'No se pudo actualizar la promoción'
          ),
      });
    }
  }

  /**
   * Gestión de errores del formulario
   */
  errorHandling(controlPath: string) {
    return getFormValidationErrorMessage(this.promotionForm, controlPath);
  }

  onReset(): void {
    this.promotionForm.reset();
    this.promotionForm.get('applyTo')!.setValue('CATEGORY');
  }

  onBack(): void {
    this.router.navigate(['/promotion']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //Obliga a seleccionar categoryId o productId según applyTo
  private targetValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const applyTo = group.get('applyTo')?.value;
      const cat = group.get('categoryId')?.value;
      const prod = group.get('productId')?.value;

      if (applyTo === 'CATEGORY' && !cat) return { target: true };
      if (applyTo === 'PRODUCT' && !prod) return { target: true };
      return null;
    };
  }

  private dateRangeValidator(): ValidatorFn {
  return (group: AbstractControl) => {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Hoy a las 00:00

    const startDate = start ? new Date(start + 'T00:00:00') : null;
    const endDate = end ? new Date(end + 'T00:00:00') : null;

    if (endDate && !startDate) return { faltaFechaInicio: true };

    if (startDate && !endDate) return { faltaFechaFin: true };

    if (startDate && startDate < today) return { fechaInicioPasada: true };

    if (startDate && endDate && endDate < startDate) return { rangoInvalido: true };

    return null; 
  };
}

}
