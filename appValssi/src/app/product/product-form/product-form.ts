import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { getFormValidationErrorMessage } from '../../share/form-validation';
import { NotificationService } from '../../share/notification-service';
import { ProductService } from '../../share/services/product.service';
import { CategoryService } from '../../share/services/category.service';
import { TagService } from '../../share/services/tag.service';
import { FileUploadService } from '../../share/services/file-upload.service';
import { TagModel } from '../../share/models/TagModel';
import { CategoryModel } from '../../share/models/CategoryModel';
import { ProductModel } from '../../share/models/ProductModel';
import { minWordsValidator } from '../../share/min-words-validator';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  titleForm: string = 'Crear';
  idProduct: number | null = null;
  isCreate: boolean = true;

  // --- Datos de los selects o combos ---
  categorias: any[] = [];
  tags: any[] = [];

  // --- Relativo al formulario ---
  productForm!: FormGroup;
  number4digits = /^\d{4}$/;
  number2decimals = /^[0-9]+[.,]{1,1}[0-9]{2,2}$/;

  // --- Gestión de imagen ---
  currentFiles: File[] = []; // Varios archivos seleccionados
  previews: string[] = []; // Vistas previas
  nameImages: string[] = []; // Nombres de imágenes
  previousImages: string[] = []; // Imágenes anteriores si está en edición
  eliminadas: string[] = []; // Almacena imágenes a eliminar

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private uploadService: FileUploadService,
    private noti: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadTags();

    this.activeRouter.params.subscribe((params: Params) => {
      this.idProduct = params['id'];
      this.isCreate = this.idProduct === undefined;

      this.setTranslatedTitle();

      if (this.idProduct != undefined) {
        this.productService
          .getById(this.idProduct)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            this.patchFormValues(data);
          });
      }
    });

    // Reaccionar al cambio de idioma para actualizar el título
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.setTranslatedTitle();
      });
  }

  private setTranslatedTitle(): void {
    const key = this.isCreate ? 'product-form.create' : 'product-form.update';
    this.translate.get(key).subscribe((value) => {
      this.titleForm = value;
    });
  }

  /**
   * Inicializar el formulario reactivo
   */
  private initForm(): void {
    this.productForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, [Validators.required, minWordsValidator(2)]],
      price: [null, [Validators.required, Validators.min(1)]],
      stock: [null, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
      categoryId: [null, [Validators.required]],
      tags: [null, Validators.required],
      averageRating: [0],
      images: [[], null],
      eliminar: [[]],
    });
  }

  private loadCategories() {
    this.categoryService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: CategoryModel[]) => {
        this.categorias = respuesta;
      });
  }

  private loadTags() {
    this.tagService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((respuesta: TagModel[]) => {
        this.tags = respuesta;
      });
  }

  /**
   * Carga en el formulario el producto existeste para actualizar.
   * @param data El objecto de respuesta del API.
   */
  private patchFormValues(data: ProductModel): void {
    this.productForm.patchValue({
      id: data.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price.toString()).toFixed(2),
      stock: data.stock,
      categoryId: data.category.id,
      tags: data.tags.map(({ id }) => id),
      averageRating: data.averageRating,
    });

    this.previousImages = data.images.map((img) => img.url);
  }

  selectFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.currentFiles.push(file);
        this.nameImages.push(file.name);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.previews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  eliminarImagenAnterior(index: number) {
    const imgEliminada = this.previousImages[index];
    this.eliminadas.push(imgEliminada); // Borrar en backend
    this.previousImages.splice(index, 1); // Eliminar visualmente
  }

  eliminarImagenNueva(index: number): void {
    this.previews.splice(index, 1);
    this.currentFiles.splice(index, 1); // También elimina el archivo del array que se manda
  }

  submitProduct(): void {
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) {
      this.noti.error(
        'Formulario Inválido',
        'Por favor, revise los campos.',
        5000
      );
      return;
    }

    const formValue = this.productForm.value;

    const payloadTags = formValue.tags?.map((id: number) => ({ id })) || [];
    const payloadPrice =
      typeof formValue.price === 'string'
        ? parseFloat(formValue.price)
        : formValue.price;
    const payloadCat =
      typeof formValue.categoryId === 'string'
        ? parseFloat(formValue.categoryId)
        : formValue.categoryId;

    // Subir nuevas imágenes si existen
    if (this.currentFiles.length > 0) {
      const uploadObservables = this.currentFiles.map((file) =>
        this.uploadService.upload(file, null)
      );

      forkJoin(uploadObservables).subscribe((responses: any[]) => {
        // Las imágenes nuevas
        const imagenesSubidas = responses.map((res) => ({ url: res.fileName }));

        // Filtro para que no haya errores en el array de imágenes anteriores, además se le da formato a la url
        const imagenesPreviasFinales = this.previousImages
          .filter((name) => !this.eliminadas.includes(name))
          .map((url) => ({ url }));

        // Junta las anteriores no eliminadas con las nuevas subidas.
        const imagenesTotales = [...imagenesPreviasFinales, ...imagenesSubidas];

        this.productForm.patchValue({
          images: imagenesTotales,
          eliminar: this.eliminadas,
          tags: payloadTags,
          price: payloadPrice,
          categoryId: payloadCat,
        });

        this.guardarProducto();
      });
    } else {
      // Solo enviar las imágenes previas que no han sido eliminadas
      const imagenesFinales = this.previousImages
        .filter((name) => !this.eliminadas.includes(name))
        .map((url) => ({ url }));

      this.productForm.patchValue({
        images:
          imagenesFinales.length > 0
            ? imagenesFinales
            : [{ url: 'image-not-found.jpg' }],
        eliminar: this.eliminadas,
        tags: payloadTags,
        price: payloadPrice,
        categoryId: payloadCat,
      });

      this.guardarProducto();
    }
  }

  guardarProducto() {
    if (this.isCreate) {
      //Accion API create enviando toda la informacion del formulario
      this.productService
        .create(this.productForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.noti.success('Crear Producto', `${data.name}`, 2000, '/product');
        });
      this.productForm.reset();
    } else {
      //Accion API actualizar enviando toda la informacion del formulario
      this.productService
        .update(this.productForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.noti.success(
            'Actualizar Producto',
            ` ${data.name}`,
            2000,
            '/product'
          );
        });
    }
  }

  errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.productForm, controlPath);
  }

  onReset(): void {
    this.productForm.reset({
      averageRating: 0,
    });
    this.previews = [];
    this.currentFiles = [];
    this.nameImages = [];
    this.previousImages = [];
    this.eliminadas = [];
  }

  onBack(): void {
    this.router.navigate(['/product']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
