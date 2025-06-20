import { CustomOptionValueModel } from "./CustomOptionValueModel";

export interface CustomOptionModel {
  id: number;
  name: string;
  values: CustomOptionValueModel[];
}
