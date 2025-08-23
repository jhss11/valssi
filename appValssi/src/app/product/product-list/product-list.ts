import { Component, computed, signal } from '@angular/core';
import { ProductModel } from '../../share/models/ProductModel';
import { ProductService } from '../../share/services/product.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { TagModel } from '../../share/models/TagModel';
import { CategoryModel } from '../../share/models/CategoryModel';
import { TagService } from '../../share/services/tag.service';
import { CategoryService } from '../../share/services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList {
  // datos: any;
    datos = signal<ProductModel[]>([]);//Lista de videojuegos
  lEtiquetas = signal<TagModel[]>([]);//Lista de generos
  lCategorias = signal<CategoryModel[]>([]); 

  etiquetasSeleccionadas = signal<number[]>([]); // IDs de géneros seleccionados
  categoriaSeleccionada = signal<number| null>(null);; // IDs de géneros seleccionados

  constructor(private vjService:ProductService,
    private noti:NotificationService,
    private etiquetasService: TagService,
    private categoriasService: CategoryService,


    private router:Router
  ) {   
    this.listProducts()
    this.listEtiquetas();
    this.listCategorias();


  }

  //Listar todos los videojuegos del API
  listProducts() {
    //localhost:3000/videojuego
    this.vjService.getMethod('promotions/active').subscribe((respuesta: ProductModel | ProductModel[]) => {
      console.log(respuesta);
      this.datos.set(respuesta as ProductModel[]);
      
    });
  }

  listCategorias() {
    //localhost:3000/genero
    this.categoriasService.get().subscribe((respuesta: CategoryModel[]) => {
      //Actualizar valor de lista de generos
      this.lCategorias.set(respuesta);
    });
  }

  listEtiquetas() {
    //localhost:3000/genero
    this.etiquetasService.get().subscribe((respuesta: TagModel[]) => {
      //Actualizar valor de lista de generos
      this.lEtiquetas.set(respuesta);
    });
  }

   filterDatos = computed(() => {
    const todos = this.datos();
    const categoria = this.categoriaSeleccionada();
    console.log(categoria)
    const etiquetas = this.etiquetasSeleccionadas();
    console.log("etiqueas:" + etiquetas)

    let filtrados = todos;

    // filtro por categoría (solo una)
    if (categoria) {
      filtrados = filtrados.filter((producto: ProductModel) => producto.categoryId === Number(categoria));
    }

    // filtro por etiquetas (pueden ser varias, con que tenga una ya vale)
    if (etiquetas.length > 0) {
      filtrados = filtrados.filter((producto: ProductModel) =>
       producto.tags?.some((tag) => etiquetas.includes(Number(tag.id)))
      );
    }
console.log("filtrados: " +filtrados)
    return filtrados;
  });

  // manejadores
  
  onCategoriaSelectChange(selectedId: number | null) {
    this.categoriaSeleccionada.set(selectedId);
  }

  onEtiquetasSelectChange(selectedIds: number[]) {
    this.etiquetasSeleccionadas.set(selectedIds);
  }

  verDetalle(id:Number) {
    this.router.navigate(['/products',id])
  }

  getPromotion(item: any): any | null {
  if (item.promotions?.length > 0) {
    // console.log('primer if', item.promotions?.length > 0)
    return item.promotions[0];
  }
  if (item.category?.promotions?.length > 0) {
    // console.log('segundo if', item.category?.promotions?.length > 0)
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
}
