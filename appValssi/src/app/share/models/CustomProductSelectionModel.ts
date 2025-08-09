import { CustomProductModel } from "./CustomProductModel";
import { CustomOptionValueModel } from "./CustomOptionValueModel";

export interface CustomProductSelectionModel {
  id: number;
  
  customProduct: CustomProductModel;
  customProductId: number;

  optionValue: CustomOptionValueModel;
  optionValueId: number;
}
