import { ProductModel } from "./ProductModel";
import { PromotionModel } from "./PromotionModel";

export interface CategoryModel {
  id: number;
  name: string;
  products: ProductModel[];
  promotions: PromotionModel[];
}
