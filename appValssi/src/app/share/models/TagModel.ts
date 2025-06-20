import { ProductModel } from "./ProductModel";

export interface TagModel {
  id: number;
  name: string;
  products: ProductModel[];
}
