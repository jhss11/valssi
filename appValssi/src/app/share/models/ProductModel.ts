import { ImageModel } from "./ImageModel";
import { CategoryModel } from "./CategoryModel";
import { TagModel } from "./TagModel";
import { ReviewModel } from "./ReviewModel";
import { CustomProductModel } from "./CustomProductModel";
import { OrderItemModel } from "./OrderItemModel";
import { PromotionModel } from "./PromotionModel";

export interface ProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  stock: number;
  averageRating: number;
  images: ImageModel[];
  category: CategoryModel;
  categoryId: number;
  tags: TagModel[];
  reviews: ReviewModel[];
  customProducts: CustomProductModel[];
  orderItems: OrderItemModel[];
  isDeleted: boolean;
  promotions: PromotionModel[];
}
