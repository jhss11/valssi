import { ProductModel } from "./ProductModel";

export interface ImageModel {
  id: number;
  url: string;
  product: ProductModel;
  productId: number;
}
