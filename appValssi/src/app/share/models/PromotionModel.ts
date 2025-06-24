import { PromoTypeModel } from "./PromoTypeModel";
import { ProductModel } from "./ProductModel";
import { CategoryModel } from "./CategoryModel";

export interface PromotionModel {
  id: number;
  name: string;
  type: PromoTypeModel;
  amount: number;
  product?: ProductModel | null;
  productId?: number | null;
  category?: CategoryModel | null;
  categoryId?: number | null;
  startDate: Date;
  endDate: Date;
  status?: string;
}