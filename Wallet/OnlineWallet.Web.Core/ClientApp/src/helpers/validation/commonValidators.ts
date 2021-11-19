import { ValidatorFunction } from "./interfaces";

export const validators = {
  required: ((value: string) => {
    return typeof value !== "undefined" && value !== null && value !== "";
  }) as ValidatorFunction<string>,

  numberFormat: ((value: any) => {
    return !value || !isNaN(value);
  }) as ValidatorFunction<string>,

  stringLength: (maxLength: number) => {
    return ((value: string) => {
      return !value || value.length <= maxLength;
    }) as ValidatorFunction<string>;
  },

  fieldEquals: ((value1: string, value2: string) => {
    return value1 === value2;
  }) as ValidatorFunction<string>,
};

validators.fieldEquals.paramCount = 2;
