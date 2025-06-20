import { ProductModel } from "./ProductModel";
import { CustomProductSelectionModel } from "./CustomProductSelectionModel";
import { OrderItemModel } from "./OrderItemModel";

export interface CustomProductModel {
  id: number;
  baseProduct: ProductModel;
  baseProductId: number;
  customProducts: CustomProductSelectionModel[];
  orderItems: OrderItemModel[];
  totalPrice: number;
}
