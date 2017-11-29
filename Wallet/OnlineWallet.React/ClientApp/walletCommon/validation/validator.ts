import { ValidationConfig, ValidationConfigElement, ValidationObject, ValidationState, ValidatorFunction } from "./interfaces";

export function validate<TState, TProps>(config: ValidationConfig<TState, TProps>, previousValidationState: ValidationState, state: any, props: any): Promise<ValidationState> {
    return new Promise<ValidationState>((resolve, reject) => {
        var newValidationState: ValidationState = {};
        var validating: Promise<void>[] = [];
        var validationStateChanged = false;
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                var elementConfig = config[key];
                var nextValue = elementConfig.valueGetter(state, props);
                var previousState: ValidationObject = previousValidationState[key];
                if (typeof previousState === "undefined") {
                    throw new Error("Please init validation state with initValidationState");
                }
                let isChanged: boolean;
                if (elementConfig.validator.compositeValue) {
                    isChanged = typeof (previousState.value) === "undefined" || compareComposite(previousState.value, nextValue)
                } else {
                    isChanged = typeof (previousState.value) === "undefined" || previousState.value !== nextValue;
                }
                if (isChanged) {
                    var isValidPromise = elementConfig.validator(nextValue);
                    if (typeof(isValidPromise) == "boolean" ) {
                        isValidPromise = Promise.resolve(isValidPromise);
                    }
                    validating.push(
                        isValidPromise
                            .then(isValid => {
                                var changed: boolean;
                                if (!previousState.isDirty || previousState.isValid !== isValid) {
                                    newValidationState[key] = {
                                        isDirty: true,
                                        isValid: isValid,
                                        showError: false,
                                        message: createMessage(elementConfig),
                                        value: nextValue
                                    };
                                    var validationObject = newValidationState[key];
                                    validationObject.showError = (elementConfig.getShowError || defaultGetShowError)(validationObject, state, props) && !validationObject.isValid;
                                    validationStateChanged = true;
                                } else {
                                    newValidationState[key] = previousState;
                                }
                            })
                    );
                } else {
                    newValidationState[key] = previousState;
                }
            }
        }
        Promise.all(validating).then(results => {
            if (validationStateChanged) {
                resolve(newValidationState);
            } else {
                resolve(previousValidationState);
            }
        });
    });
}

export function initValidationState<TState, TProps>(config: ValidationConfig<TState, TProps>, validationState: ValidationState, state: any, props: any) {
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

function defaultGetShowError(validationObject:ValidationObject) {
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