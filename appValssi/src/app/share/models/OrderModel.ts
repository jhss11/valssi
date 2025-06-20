import { UserModel } from "./UserModel";
import { OrderItemModel } from "./OrderItemModel";
import { OrderStatusLogModel } from "./OrderStatusLogModel";
import { OrderStatusModel } from "./OrderStatusModel";

export interface OrderModel {
  id: number;
  user: UserModel;
  userId: number;
  createdAt: Date;
  status: OrderStatusModel;
  items: OrderItemModel[];
  address: string;
  paymentMethod: string;
  subtotal: number;
  total: number;
  statusLogs: OrderStatusLogModel[];
}