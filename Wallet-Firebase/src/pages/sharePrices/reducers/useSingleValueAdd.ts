import { useReducer, useCallback } from 'react';

export function useSingleValueAdd(onAddPerson: (name: string) => void) {
    const [state, dispatch] = useReducer(reducer, undefined, init);

    const changeHandler = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        var newValue = evt.target.value;
        dispatch({ type: "SetValue", value: newValue });
    }, []);

    const submitHandler = useCallback((evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        dispatch({ type: "Submit", submitSuccess: onAddPerson });
    }, [onAddPerson]);

    return { state, changeHandler, submitHandler };
}

function reducer(state: IValueWithValidator, action: IActions) {
    let newState = state;
    switch (action.type) {
        case "SetValue":
            newState = {
                ...state,
                value: action.value,
                invalid: !action.value
            };
            break;
        case "Submit":
            if (state.invalid) {
                newState = {
                    ...state,
                    showError: true
                };
            } else {
                action.submitSuccess(state.value);
                newState = init();
            }

            break;
    }
    return newState;
}

function init(): IValueWithValidator {
    return {
        value: "",
        invalid: true,
        showError: false
    }
}

type IActions = ISetValue | ISubmit;

interface ISetValue {
    type: "SetValue";
    value: string
}

interface ISubmit {
    type: "Submit";
    submitSuccess(name: string): void;
}

interface IValueWithValidator {
    value: string;
    invalid: boolean,
    showError: boolean
}
