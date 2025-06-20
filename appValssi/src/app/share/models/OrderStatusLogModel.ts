import { OrderModel } from "./OrderModel";
import { OrderStatusModel } from "./OrderStatusModel";
import { UserModel } from "./UserModel";

export interface OrderStatusLogModel {
  id: number;
  order: OrderModel;
  orderId: number;
  status: OrderStatusModel;
  changedBy: UserModel;
  adminId: number;
  changedAt: Date;
}
