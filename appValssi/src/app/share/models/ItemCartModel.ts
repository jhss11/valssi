import { ProductModel } from "./ProductModel";


export interface ItemCartModel {

    product: ProductModel;
    quantity: number;
    subtotal: number;
    // price: number;
  }