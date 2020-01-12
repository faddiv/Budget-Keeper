import { ValidationConfig, ValidationState, ValidationResult, ValidationStateElement } from "./interfaces";

export function validate<TState, TProps>(config: ValidationConfig<TState, TProps>, previousValidationState: ValidationState, state: TState | undefined | null, props: TProps, showErrors?: boolean): ValidationResult {
    const result: ValidationResult = {
        validationState: {},
        changed: false,
        isValid: true
    };
    for (const key in config) {
        if (!config.hasOwnProperty(key)) { continue; }
        const elementConfig = config[key];
        const nextValue = state
            ? (elementConfig.valueGetter
                ? elementConfig.valueGetter(state, props)
                : defaultGetter(state, key))
            : "";
        const previousStateElement = previousValidationState[key];
        const previousValue = previousStateElement && previousStateElement.value;
        let nextStateElement: ValidationStateElement | undefined = undefined;
        for (const validatorC of elementConfig.validators) {
            const validatorF = validatorC.validator;
            let isValid: boolean;
            if (validatorF.paramCount && validatorF.paramCount > 1) {
                if (!validatorC.extraParams || validatorC.extraParams.length + 1 !== validatorF.paramCount) {
                    throw new Error(`the validator ${validatorF} requires additional ${validatorF.paramCount - 1}parameter.`);
                }
                const values = [nextValue];
                for (const element of validatorC.extraParams) {
                    values.push(state ? element(state, props) : undefined);
                }
                isValid = validatorF.call(null, values);
            } else {
                isValid = validatorF(nextValue);
            }
            if (!isValid) {
                const shouldShowError = (elementConfig.shouldShowError || defaultGetShowError);
                nextStateElement = {
                    isDirty: !!previousStateElement && nextValue !== previousValue,
                    isValid,
                    showError: !!showErrors,
                    value: nextValue
                };
                nextStateElement.showError = !isValid && shouldShowError(nextStateElement, state, props);
                if (nextStateElement.showError) {
                    nextStateElement.message = validatorC.message;
                }
                break;
            }
        }
        if (!nextStateElement) {
            nextStateElement = {
                isDirty: !!previousStateElement && nextValue !== previousValue,
                isValid: true,
                showError: false,
                value: nextValue
            };
        }
        const changed = !previousStateElement
            || previousStateElement.isDirty !== nextStateElement.isDirty
            || previousStateElement.isValid !== nextStateElement.isValid
            || previousStateElement.showError !== nextStateElement.showError;
        if (changed) {
            result.changed = true;
        } else {
            nextStateElement = previousStateElement;
        }
        result.isValid = result.isValid && nextStateElement.isValid;
        result.validationState[key] = nextStateElement;
    }
    if (!result.changed) {
        result.validationState = previousValidationState;
    }
    return result;
}

function defaultGetter(state: any, key: string) {
    return state[key];
}

function defaultGetShowError(validationObject: ValidationStateElement) {
    return validationObject.showError || validationObject.isDirty;
}
