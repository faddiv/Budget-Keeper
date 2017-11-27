export interface ValidationState {
    [propertyName: string]: ValidationObject;
}
export interface ValidationObject {
    message: string;
    isValid: boolean;
    value: any;
}
export interface ValidationConfig {
    [propertyName: string]: ValidationConfigElement<any>;
}

export interface ValidatorFunction<TValue> {
    (value: TValue): boolean | Promise<boolean>;
    async?: boolean;
    compositeValue?: boolean;
}

export interface ValidationConfigElement<TValue> {
    message: string,
    messageParams: any;
    validator: ValidatorFunction<TValue>;
    valueGetter: (state: any, props: any) => TValue;
}