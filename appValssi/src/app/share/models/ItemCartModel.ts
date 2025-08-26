import { ProductModel } from "./ProductModel";


export interface ItemCartModel {

    product: ProductModel;
    quantity: number;
    subtotal: number;
    total: number;
    customizations?: {
    totalPrice: number;
    selectedOptions: { optionValueId: number; name?: string, price?: number }[];
  };
    // price: number;
  }