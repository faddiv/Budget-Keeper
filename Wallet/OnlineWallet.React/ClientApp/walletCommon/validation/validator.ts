import { ValidationConfig, ValidationConfigElement, ValidationObject, ValidationState, ValidatorFunction } from "./interfaces";

export function validate(config: ValidationConfig, previosValidationState: ValidationState, state: any, props: any): Promise<ValidationState> {
    return new Promise<ValidationState>((resolve, reject) => {
        var nextValidationState: ValidationState = {};
        var validating: Promise<void>[] = [];
        var validationStateChanged = false;
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                var elementConfig = config[key];
                var nextValue = elementConfig.valueGetter(state, props);
                var previousState: ValidationObject = previosValidationState[key];
                if (typeof previousState === "undefined") {
                    previousState = {
                        isValid: false,
                        message: createMessage(elementConfig),
                        value: nextValue
                    }
                    validationStateChanged = true;
                }
                let isChanged: boolean;
                if (elementConfig.validator.compositeValue) {
                    isChanged = typeof (previousState.value) == "undefined" || compareComposite(previousState.value, nextValue)
                } else {
                    isChanged = typeof (previousState.value) == "undefined" || previousState.value !== nextValue;
                }
                if (isChanged) {
                    var isValidPromise: Promise<boolean>;
                    if (elementConfig.validator.async || elementConfig.async) {
                        isValidPromise = elementConfig.validator(nextValue) as Promise<boolean>;
                    } else {
                        var isValid = elementConfig.validator(nextValue) as boolean;
                        isValidPromise = Promise.resolve(isValid);
                    }
                    validating.push(
                        isValidPromise
                            .then(isValid => {
                                if (previousState.isValid !== isValid) {
                                    nextValidationState[key] = {
                                        isValid: isValid,
                                        message: createMessage(elementConfig),
                                        value: nextValue
                                    };
                                    validationStateChanged = true;
                                } else {
                                    nextValidationState[key] = previousState;
                                }
                            })
                    );
                } else {
                    nextValidationState[key] = previousState;
                }
            }
        }
        Promise.all(validating).then(results => {
            if (validationStateChanged) {
                resolve(nextValidationState);
            } else {
                resolve(previosValidationState);
            }
        });
    });
}

function createMessage(elementConfig: ValidationConfigElement<any>) {
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