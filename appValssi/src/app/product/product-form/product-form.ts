import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../share/services/category.service';
import { ProductService } from '../../share/services/product.service';
import { NotificationService } from '../../share/notification-service';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { TagService } from '../../share/services/tag.service';
import { FileUploadService } from '../../share/services/file-upload.service';

@Component({
  selector: 'app-producto-form',
  standalone: false,
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
})
export class ProductForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  titleForm: string = 'Crear';
  idProduct: number | null = null;
  isCreate: boolean = true;

  productoForm!: FormGroup;
  categorias: any[] = [];
  tags: any[] = [];
  imagenes: File[] = [];
  previews: string[] = [];

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoryService,
    private tagService: TagService,
    private productoService: ProductService,
    private uploadService: FileUploadService,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarCategorias();
    this.cargarEtiquetas();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      tags: [[], Validators.required],
    });
  }

  cargarCategorias(): void {
    this.categoriaService.get().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.categorias = data;
    });
  }

  cargarEtiquetas(): void {
    this.tagService.get().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.tags = data;
    });
  }

  seleccionarImagenes(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.imagenes = Array.from(input.files);
      this.previews = [];
      this.imagenes.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => this.previews.push(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  }

  submitProducto(): void {
    this.productoForm.markAllAsTouched();
    if (this.productoForm.invalid) {
      this.noti.error('Formulario Inválido', 'Revise los campos requeridos.', 5000);
      return;
    }

    const formValue = this.productoForm.value;
    const tagsPayload = formValue.tags.map((id: number) => ({ id }));

    if (this.imagenes.length > 0) {
      const formData = new FormData();
      this.imagenes.forEach((img) => formData.append('files', img));

      // this.uploadService.uploadMultiple(formData).subscribe((res: any) => {
      //   const imageUrls = res.map((img: any) => img.filename);

      //   const payload = {
      //     ...formValue,
      //     tags: tagsPayload,
      //     images: imageUrls,
      //   };

      //   this.crearProducto(payload);
      // });
    } else {
      this.crearProducto({
        ...formValue,
        tags: tagsPayload,
        images: [],
      });
    }
  }

  crearProducto(payload: any): void {
    this.productoService.create(payload).subscribe((data: any) => {
      this.noti.success('Producto creado', `ID: ${data.id}`, 4000, '/producto-admin');
    });
  }

  errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.productoForm, controlPath);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
