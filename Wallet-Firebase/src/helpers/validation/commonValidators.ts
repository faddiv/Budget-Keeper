import { ValidatorFunction } from "./interfaces";
interface IValidator {
    required: ValidatorFunction<string>
    numberFormat: ValidatorFunction<string>
    stringLength: (maxLength: number) => ValidatorFunction<string>
    fieldEquals: ValidatorFunction<string>
}

export const validators: IValidator = {
    required(value: string) {
        return typeof value !== "undefined" && value !== null && value !== "";
    },// as ValidatorFunction<string>

    numberFormat(value: any) {
        return !value || !isNaN(value);
    }, //ValidatorFunction<string> 

    stringLength(maxLength: number) {
        return (value: string) => {
            return !value || value.length <= maxLength;
        };
    }, // ValidatorFunction<string>

    fieldEquals(value1: string, value2: string) {
        return value1 === value2;
    }// ValidatorFunction<string>
    
};
validators.fieldEquals.paramCount = 2;
