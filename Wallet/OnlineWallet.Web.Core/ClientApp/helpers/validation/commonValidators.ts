import { ValidatorFunction } from "./interfaces";

export const required: ValidatorFunction<string> = function (value: string) {
    return typeof value !== "undefined" && value !== null && value !== "";
}
export const numberFormat: ValidatorFunction<string> = function (value: any) {
    return !value || !isNaN(value);
}
export function stringLength(maxLength: number): ValidatorFunction<string> {
    return function (value: string) {
        return !value || value.length <= maxLength;
    }
}
export const fieldEquals: ValidatorFunction<string> = function (value1: string, value2: string) {
    return value1 === value2;
}
fieldEquals.paramCount = 2;