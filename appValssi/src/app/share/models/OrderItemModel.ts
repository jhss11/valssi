import { OrderModel } from "./OrderModel";
import { ProductModel } from "./ProductModel";
import { CustomProductModel } from "./CustomProductModel";

export interface OrderItemModel {
  id: number;
  order: OrderModel;
  orderId: number;
  product?: ProductModel | null;
  productId?: number | null;
  customProduct?: CustomProductModel | null;
  customProductId?: number | null;
  quantity: number;
}
