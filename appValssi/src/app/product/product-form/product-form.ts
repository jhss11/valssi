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
import { minWordsValidator } from '../../share/validators/min-words-validator';
import { ProductModel } from '../../share/models/ProductModel';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
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
  // currentFile?: File;
  // previewUrls: string[] = [];
  // nameImage: string = 'image-not-found.jpg';
  // previousImage: string | null = null;

 currentFiles: File[] = [];
previewUrls: string[] = [];
previousImages: string[] = []; // si estás actualizando
nameImages: string[] = [];

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
    //Inicializar formulario
    this.initForm();
    //Obtener lista de categorías
    this.loadCategories();
    //Obtener lista de etiquetas
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
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(1)]],
      stock: [null, [Validators.required, Validators.min(1)]],
      categoryId: [null, [Validators.required]],
      tags: [null, Validators.required],
      averageRating:[null],
      images: [[]],
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

  selectFiles(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.currentFiles = Array.from(input.files);
    this.previewUrls = [];

    this.currentFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.previewUrls.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  } else {
    this.previewUrls = [];
    this.currentFiles = [];
  }
}


  

  submitProduct(): void {

    this.productForm.markAllAsTouched();

     if (this.productForm.invalid) {
       console.log('Formulario inválido:', this.productForm.errors);

  Object.keys(this.productForm.controls).forEach(key => {
    const control = this.productForm.get(key);
    if (control?.invalid) {
      console.warn(`❌ Campo inválido: ${key}`, control.errors);
    }
  });
    this.noti.error(
      'Formulario Inválido',
      'Por favor, revise los campos marcados en rojo.',
      5000
    );
    console.log('Formulario inválido:', this.productForm.errors);
    return;
  }

  const formValue = this.productForm.value;
    console.log(formValue);

  // Transformar tags en formato correcto para el API
  const payloadTags = formValue.tags
    ? formValue.tags.map((id: number) => ({ id }))
    : [];

  // Verificar que el precio sea un número
  const payloadPrice =
    typeof formValue.price === 'string'
      ? parseFloat(formValue.price)
      : formValue.price;

       // Verificar que el precio sea un número
  const payloadCat =
    typeof formValue.categoryId === 'string'
      ? parseFloat(formValue.categoryId)
      : formValue.categoryId;
   this.productForm.patchValue({
        tags: payloadTags,
        price: payloadPrice,
        categoryId: payloadCat
        // imagen: this.previousImage,
      });

if (this.currentFiles.length > 0) {
  this.uploadService
    .uploadMultiple(this.currentFiles, this.previousImages)
    .pipe(takeUntil(this.destroy$))
    .subscribe((uploaded: any[]) => {
      this.nameImages = uploaded.map((u: any) => u.filename);
      this.productForm.patchValue({
        images: this.nameImages,
        tags: payloadTags,
        price: payloadPrice,
        categoryId: payloadCat,
      });
      this.guardarProducto(); // ✅ Solo se llama cuando ya se cargaron las imágenes
    });
} else {
  this.productForm.patchValue({
    images: this.previousImages,
    tags: payloadTags,
    price: payloadPrice,
    categoryId: payloadCat,
  });
  this.guardarProducto();
}

     //Paso 2: Guardar/actualizar el videojuego en el API
      this.guardarProducto();

  }
  guardarProducto() {
     if (this.isCreate) {
      //Accion API create enviando toda la informacion del formulario
      this.productService
        .create(this.productForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          this.noti.success(
            'Crear Producto',
            `Producto creado: ${data.name}`,
            5000, '/product'
            // '/videojuego-admin'
          );
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
            `Producto actualizado: ${data.name}`,
            5000, '/product'
            // '/videojuego-admin'
            
          );
        });

    }
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
