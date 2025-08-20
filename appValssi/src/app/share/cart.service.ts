import { Injectable, signal, computed, effect } from '@angular/core';
import { OrderItemModel } from './models/OrderItemModel';
import { ProductModel } from './models/ProductModel';
import { ItemCartModel } from './models/ItemCartModel';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // El signal principal para el estado del carrito
  // Se inicializa cargando desde localStorage
  private cart = signal<ItemCartModel[]>(this.loadCartFromStorage());

  public readonly itemsCart = computed(() => this.cart());

  // Signals computado para la cantidad total de ítems y el total del carrito
  // Se recalculan automáticamente cuando 'cart' cambia
  public qtyItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  public total = computed(() =>
    this.cart().reduce((total, item) => total + item.total, 0)
  );

  constructor() {
    // Un efecto para guardar el carrito en localStorage cada vez que 'cart' cambia
    // Reemplaza el 'saveCart()' manual en cada operación
    effect(() => {
      localStorage.setItem('orden', JSON.stringify(this.cart()));
      console.log('Carrito guardado en localStorage:', this.cart()); 
    });
  }

  // Cargar el carrito de localStorage
  private loadCartFromStorage(): ItemCartModel[] {
    if (typeof localStorage !== 'undefined') {
      // Verificar que localStorage esté disponible
      const cartData = localStorage.getItem('orden');
      return cartData ? JSON.parse(cartData) : [];
    }
    return []; // Retorna un array vacío si localStorage no está disponible
  }

  // Calcular subtotal para un producto
  private calculateSubtotal(producto: ProductModel, cantidad: number): number {
    return producto.price * cantidad;
  }

  // Calcular total para un producto
  private calculateTotal(producto: ProductModel, subtotal: number, cantidad: number): number {
    const discount = this.calculatePromotions(producto, cantidad);
    return subtotal - discount;
  }

  private calculatePromotions(product: ProductModel, cantidad: number): number {
    let discount = 0;
    const today = new Date();

    const promos = [
      ...(product.category?.promotions || []),
      ...(product.promotions || []),
    ];

    promos.forEach((promo) => {
      const start = new Date(promo.startDate);
      const end = new Date(promo.endDate);

      if (today >= start && today <= end) {
        if (promo.type === 'PERCENTAGE') {
          discount += (product.price * promo.amount) / 100;
        } else {
          discount += promo.amount;
        }
      }
    });

    return discount * cantidad; // total descuento aplicado por cantidad
  }

  // --- Métodos del Carrito ---

  /**
   * Agrega un producto al carrito.
   * Si el producto ya existe, actualiza su cantidad.
   * Si no existe, lo añade como un nuevo ítem.
   * @param producto El videojuego a añadir.
   * @param quantity Cantidad opcional para establecer; si no se especifica, incrementa en 1.
   */

  addToCart(
    product: ProductModel,
    quantity?: number,
    customizations?: any
  ): void {
    this.cart.update((currentCart) => {
      const listCart = [...currentCart];

    //Verifica si el item existe y obtiene su index
      const existingItemIndex = listCart.findIndex(
        (item) =>
          item.product?.id === product.id &&
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );

      //Si existe...
      if (existingItemIndex !== -1) {
        const existingItem = listCart[existingItemIndex];

        //Si llega quantity, se usa, si no llega, incrementa en 1
        const newQuantity =
          quantity !== undefined ? Number(quantity) : existingItem.quantity + 1;

        // Si la nueva cantidad es 0 o negativa, se elimina el item
        if (newQuantity <= 0) {
          listCart.splice(existingItemIndex, 1);
        } else {

          //Si no, recalcula el subtotal, si tiene customizaciones totalPrice es el precio unitario personalizado
          // y se multiplica por la cantidad, si no llama a calculateSubtotal
          const subtotal = customizations
            ? customizations.totalPrice * newQuantity
            : this.calculateSubtotal(existingItem.product, newQuantity);

            //Actualiza el ítem con la nueva cantidad y subtotal.
          listCart[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
            subtotal: subtotal,
            total: this.calculateTotal(product, subtotal, quantity ?? 1),
          };
        }
      } else {
      //Si el ítem no existía en el carrito, se calcula el subtotal igual que arriba
        const subtotal = customizations
          ? customizations.totalPrice * (quantity ?? 1)
          : this.calculateSubtotal(product, quantity ?? 1);
          //Inserta el nuevo item
        listCart.push({
          product,
          quantity: quantity ? Number(quantity) : 1,
          subtotal: subtotal,
          customizations,
          total: this.calculateTotal(product, subtotal, quantity ?? 1),
        });
      }

      return listCart;
    });
  }

  /**
   * Elimina un producto del carrito por su ID.
   * @param productId El ID del producto a eliminar.
   */
  removeFromCart(productId: number, customizations?: any): void {
    this.cart.update((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.product?.id === productId &&
            JSON.stringify(item.customizations) ===
              JSON.stringify(customizations)
          )
      )
    );
  }

  /**
   * Borra todo el carrito, dejándolo vacío.
   */
  deleteCart(): void {
    this.cart.set([]); // Establecer el signal a un array vacío
  }
}
