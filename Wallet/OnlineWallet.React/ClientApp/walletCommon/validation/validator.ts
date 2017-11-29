import { ValidationConfig, ValidationConfigElement, ValidationState, ValidationStates, ValidatorFunction, ValidationResult } from "./interfaces";

export function validate<TState, TProps>(config: ValidationConfig<TState, TProps>, previousValidationState: ValidationStates, state: any, props: any): Promise<ValidationResult> {
    return new Promise<ValidationResult>((resolve, reject) => {
        var result: ValidationResult = {
            validationState: {},
            changed: false,
            isValid: true
        };
        var validating: Promise<void>[] = [];
        for (const key in config) {
            if (config.hasOwnProperty(key)) {
                const elementConfig = config[key];
                const nextValue = elementConfig.valueGetter(state, props);
                const previousState: ValidationState = previousValidationState[key];
                if (typeof previousState === "undefined") {
                    throw new Error("Please init validation state with initValidationState");
                }
                let isChanged: boolean;
                if (elementConfig.validator.compositeValue) {
                    isChanged = typeof (previousState.value) === "undefined" || compareComposite(previousState.value, nextValue)
                } else {
                    isChanged = typeof (previousState.value) === "undefined" || previousState.value !== nextValue;
                }
                const getShowError = (elementConfig.getShowError || defaultGetShowError);
                const showError = getShowError(previousState, state, props);
                if (isChanged) {
                    var isValidPromise = elementConfig.validator(nextValue);
                    if (typeof (isValidPromise) == "boolean") {
                        isValidPromise = Promise.resolve(isValidPromise);
                    }
                    validating.push(
                        isValidPromise
                            .then(isValid => {
                                if (!previousState.isDirty || previousState.isValid !== isValid || showError !== previousState.showError) {
                                    result.validationState[key] = {
                                        isDirty: true,
                                        isValid: isValid,
                                        showError: false,
                                        message: createMessage(elementConfig),
                                        value: nextValue
                                    };
                                    result.changed = true;
                                    const validationState = result.validationState[key];
                                    validationState.showError = getShowError(validationState, state, props) && !validationState.isValid;
                                    result.isValid = result.isValid && isValid;
                                } else {
                                    result.validationState[key] = previousState;
                                    result.isValid = result.isValid && previousState.isValid;
                                }
                            })
                    );
                } else {
                    if(previousState.showError !== showError) {
                        result.validationState[key] = {
                            ...previousState,
                            showError: showError && !previousState.isValid
                        };
                        result.changed = true;
                    } else {
                        result.validationState[key] = previousState;
                    }
                    result.isValid = result.isValid && previousState.isValid;
                }
            }
        }
        Promise.all(validating).then(results => {
            resolve(result);
        });
    });
}

export function initValidationState<TState, TProps>(config: ValidationConfig<TState, TProps>, validationState: ValidationStates, state: any, props: any) {
    for (let key in config) {
        if (config.hasOwnProperty(key)) {
            const elementConfig = config[key];
            const nextValue = elementConfig.valueGetter(state, props);
            validationState[key] = {
                isDirty: false,
                isValid: false,
                showError: false,
                message: createMessage(elementConfig),
                value: nextValue
            };
        }
    }
}

function defaultGetShowError(validationObject: ValidationState) {
    return validationObject.isDirty;
}

function createMessage(elementConfig: ValidationConfigElement<any, any, any>) {
    //TODO: Add parameters.
    return elementConfig.message;
}

function compareComposite(previousValue: any, nextValue: any): boolean {
    for (var key in nextValue) {
        if (nextValue.hasOwnProperty(key)) {
            var nextValuePart = nextValue[key];
            var prevValuePart = previousValue[key];
            if (nextValuePart !== prevValuePart) {
                return true;
            }
        }
    }
    return false;
}