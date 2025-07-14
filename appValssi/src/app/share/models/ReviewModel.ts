import { UserModel } from "./UserModel";
import { ProductModel } from "./ProductModel";
import { ReviewModerationRequestModel } from "./ReviewModerationRequestModel";

export interface ReviewModel {
  id?: number;
  user?: UserModel;
  userId?: number;
  product?: ProductModel;
  productId: number;
  rating: number;
  description: string;
  date: Date | undefined;
  isHidden?: boolean;
  reported?: boolean;
  moderationRequests?: ReviewModerationRequestModel[];
}
