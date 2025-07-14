import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  titleForm: string = 'Crear';
  isCreate: boolean = true;
  idProduct: number | null = null;

  productForm!: FormGroup;
  // --- Datos de los selects o combos ---
  categorias: any[] = [];
  tags: any[] = [];

  // --- Gestión de imagen ---
  // currentFile?: File;
  // previewUrls: string[] = [];
  // nameImage: string = 'image-not-found.jpg';
  // previousImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private uploadService: FileUploadService,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadTags();

    //Verificar si se envio un id por parametro para crear formulario para actualizar
    this.activeRouter.params.subscribe((params: Params) => {
      this.idProduct = params['id'];
      //Identificar sí es crear o Actualizar
      this.isCreate = this.idProduct === undefined;//no NULL
      this.titleForm = this.isCreate ? 'Crear' : 'Actualizar';
      if (this.idProduct != undefined) {
        //Obtener del API el videojuego se va a actualizar
        this.productService
          .getById(this.idProduct)
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
    this.productForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      categoryId: [null, [Validators.required]],
      tags: [[], Validators.required],
      // image: [this.nameImage],
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
   * Carga en el formulario el videojuego existeste para actualizar.
   * @param data El objecto de respuesta del API.
   */
  private patchFormValues(data: any): void {
    this.productForm.patchValue({
      id: data.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price.toString()).toFixed(2),
      stock: data.stock,
      categoryId: data.category?.id,
      tags: data.tags?.map((t: any) => t.id),
      // image: data.image,
    });

    // this.nameImage = data.image || 'image-not-found.jpg';
    // this.previousImage = data.image;
  }

  // selectFile(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.currentFile = input.files[0];
  //     const reader = new FileReader();
  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       this.previewUrls = [e.target?.result as string];
  //     };
  //     reader.readAsDataURL(this.currentFile);
  //   } else {
  //     this.previewUrls = [];
  //     this.currentFile = undefined;
  //     // this.nameImage = this.previousImage || 'image-not-found.jpg';
  //   }
  // }

  guardarProducto() {
     if (this.isCreate) {
      //Accion API create enviando toda la informacion del formulario
      this.productService
        .create(this.productForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.noti.success(
            'Crear Producto',
            `Producto creado: ${data.nombre}`,
            5000,
            // '/videojuego-admin'
          );
        });
    } else {
      //Accion API actualizar enviando toda la informacion del formulario
      this.productService
        .update(this.productForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.noti.success(
            'Actualizar Producto',
            `Videojuego producto: ${data.nombre}`,
            5000,
            // '/videojuego-admin'
          );
        });
    }
  }

  submitProduct(): void {

    this.productForm.markAllAsTouched();
     if (this.productForm.invalid) {
    this.noti.error(
      'Formulario Inválido',
      'Por favor, revise los campos marcados en rojo.',
      5000
    );
    console.log('Formulario inválido:', this.productForm.errors);
    return;
  }

  const formValue = this.productForm.value;

  // Transformar tags en formato correcto para el API
  const payloadTags = formValue.tags
    ? formValue.tags.map((id: number) => ({ id }))
    : [];

  // Verificar que el precio sea un número
  const payloadPrice =
    typeof formValue.price === 'string'
      ? parseFloat(formValue.price)
      : formValue.price;

    // const afterUpload = (imageFileName: string | null) => {
    //   payload.image = imageFileName ?? this.previousImage;
    //   if (this.isCreate) {
    //     this.productService.create(payload).subscribe((data: any) => {
    //       this.noti.success('Product creado', `Name: ${data.name}`, 3000, '/product');
    //     });
    //   } else {
    //     this.productService.update(payload).subscribe((data: any) => {
    //       this.noti.success('Producto actualizado', `Name: ${data.name}`, 3000, '/product');
    //     });
    //   }
    // };

    // if (this.currentFile) {
    //   this.uploadService.upload(this.currentFile, this.previousImage).subscribe((res: any) => {
    //     this.nameImage = res.filename;
    //     afterUpload(res.filename);
    //   });
    // } else {
    //   afterUpload(null);
    // }
     //Paso 2: Guardar/actualizar el videojuego en el API
      this.guardarProducto();
  }

  errorHandling(controlPath: string): string | false {
    return getFormValidationErrorMessage(this.productForm, controlPath);
  }

  onReset(): void {
    this.productForm.reset();
    // this.previewUrls = [];
    // this.currentFile = undefined;
    // this.nameImage = 'image-not-found.jpg';
  }

  onBack(): void {
    this.router.navigate(['/product']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
