import { CustomOptionModel } from "./CustomOptionModel";
import { CustomProductSelectionModel } from "./CustomProductSelectionModel";

export interface CustomOptionValueModel {
  id: number;

  value: string;

  option: CustomOptionModel;
  optionId: number;
  
  price: number;
  selections: CustomProductSelectionModel[];
}
