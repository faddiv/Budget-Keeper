export interface ValidationStates {
    [propertyName: string]: ValidationState;
}
export interface ValidationResult {
    validationState: ValidationStates;
    isValid: boolean;
    changed: boolean;
}
interface PropertyValidationStates {
    [propertyName: string]: ValidationState;
}
export interface ValidationRoot {
    isValid: boolean;
}
export interface ValidationState {
    message: string;
    isValid: boolean;
    isDirty: boolean;
    showError: boolean;
    value: any;
}
export interface ValidationConfig<TState, TProps> {
    [propertyName: string]: ValidationConfigElement<TState, TProps, any>;
}

export interface ValidatorFunction<TValue> {
    (value: TValue): boolean | Promise<boolean>;
    compositeValue?: boolean;
}

export type GetShwoErrorFunc<TState, TProps> = (validationState: ValidationState, state: TState, props: TProps) => boolean;

export interface ValidationConfigElement<TState, TProps, TValue> {
    message: string,
    messageParams?: any;
    validator: ValidatorFunction<TValue>;
    valueGetter: (state: TState, props: TProps) => TValue;
    getShowError?: GetShwoErrorFunc<TState, TProps>;
}