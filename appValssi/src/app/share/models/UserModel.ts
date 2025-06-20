import { RoleModel } from "./RoleModel";
import { ReviewModel } from "./ReviewModel";
import { OrderModel } from "./OrderModel";
import { OrderStatusLogModel } from "./OrderStatusLogModel";
import { ReviewModerationRequestModel } from "./ReviewModerationRequestModel";

export interface UserModel {
  id: number;
  username: string;
  email: string;
  password: string;
  role: RoleModel;
  lastLogin?: Date;
  reviews: ReviewModel[];
  orders: OrderModel[];
  statusChanges: OrderStatusLogModel[];
  moderationRequests: ReviewModerationRequestModel[];
}