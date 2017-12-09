import { ValidatorFunction } from "./interfaces";

export namespace validators {
    export const required: ValidatorFunction<string> = (value: string) => {
        return typeof value !== "undefined" && value !== null && value !== "";
    };

    export const numberFormat: ValidatorFunction<string> = (value: any) => {
        return !value || !isNaN(value);
    };

    export function stringLength(maxLength: number): ValidatorFunction<string> {
        return (value: string) => {
            return !value || value.length <= maxLength;
        };
    }

    export const fieldEquals: ValidatorFunction<string> = (value1: string, value2: string) => {
        return value1 === value2;
    };
    fieldEquals.paramCount = 2;
}
