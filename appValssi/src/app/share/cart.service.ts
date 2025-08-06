import { Injectable, signal, computed, effect } from '@angular/core';
import { OrderItemModel} from './models/OrderItemModel';
import { ProductModel } from './models/ProductModel';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // El signal principal para el estado del carrito
  // Se inicializa cargando desde localStorage
  private cart = signal<OrderItemModel[]>(this.loadCartFromStorage());

  public readonly itemsCart = computed(() => this.cart());

  // Signals computado para la cantidad total de ítems y el total del carrito
  // Se recalculan automáticamente cuando 'cart' cambia
  public qtyItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

//no esoty segura si el precio es en individual por ese tipo de producto o si es por la cantidad de productos
  public total = computed(() =>
    this.cart().reduce((total, item) => total + item.price, 0)
  );

  constructor() {
    // Un efecto para guardar el carrito en localStorage cada vez que 'cart' cambia
    // Reemplaza el 'saveCart()' manual en cada operación
    effect(() => {
      localStorage.setItem('orden', JSON.stringify(this.cart()));
      console.log('Carrito guardado en localStorage:', this.cart()); // Para depuración
    });
  }

  // Cargar el carrito de localStorage
  private loadCartFromStorage(): OrderItemModel[] {
    if (typeof localStorage !== 'undefined') { // Verificar que localStorage esté disponible
      const cartData = localStorage.getItem('orden');
      return cartData ? JSON.parse(cartData) : [];
    }
    return []; // Retorna un array vacío si localStorage no está disponible
  }

  // Calcular subtotal para un producto
  private calculateSubtotal(producto: ProductModel, cantidad: number): number {
    return producto.price * cantidad;
  }

  // --- Métodos del Carrito ---

  /**
   * Agrega un producto al carrito.
   * Si el producto ya existe, actualiza su cantidad.
   * Si no existe, lo añade como un nuevo ítem.
   * @param producto El videojuego a añadir.
   * @param quantity Cantidad opcional para establecer; si no se especifica, incrementa en 1.
   */
  addToCart(product: ProductModel, quantity?: number): void {
    // `update` para modificar el signal de forma inmutable
    this.cart.update((currentCart) => {
      const listCart = [...currentCart]; // Crear una copia de la compra
      const existingItemIndex = listCart.findIndex(
        (item) => item.product?.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Si el producto ya existe
        const existingItem = listCart[existingItemIndex];
        let newQuantity: number;

        if (quantity !== undefined) {
          newQuantity = Number(quantity);
        } else {
          newQuantity = existingItem.quantity + 1;
        }

        if (newQuantity <= 0) {
          // Si la cantidad llega a 0 o menos, eliminar el ítem
          listCart.splice(existingItemIndex, 1);
        } else {
          // Actualizar cantidad y subtotal del ítem existente
          listCart[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
            // subtotal: this.calculateSubtotal(existingItem.product, newQuantity),
          };
        }
      } else {
        // Si el producto no existe, añadirlo como un nuevo ítem
        listCart.push({
          product,
          quantity: quantity ? Number(quantity) : 1,
          price: 0
        });
          // subtotal: this.calculateSubtotal(producto, quantity ? Number(quantity) : 1),

      }
      return listCart;
    });
  }

  /**
   * Elimina un producto del carrito por su ID.
   * @param productId El ID del producto a eliminar.
   */
  removeFromCart(productId: number): void {
    this.cart.update((currentCart) =>
      currentCart.filter((item) => item.product?.id !== productId)
    );
  }


  /**
   * Borra todo el carrito, dejándolo vacío.
   */
  deleteCart(): void {
    this.cart.set([]); // Establecer el signal a un array vacío
  }
}