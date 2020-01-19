import { useReducer, useCallback } from 'react';

export function useTwoValueAdd(onAddPerson: ITwoValueAdddHandller) {
    const [state, dispatch] = useReducer(reducer, undefined, init);

    const nameChangeHandler = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        var newValue = evt.target.value;
        dispatch({ type: "SetValue", value: newValue });
    }, []);

    const priceChangeHandler = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        var newValue = evt.target.value;
        dispatch({ type: "SetPrice", price: newValue });
    }, []);

    const submitHandler = useCallback((evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        dispatch({ type: "Submit", submitSuccess: onAddPerson });
    }, [onAddPerson]);

    return { state, nameChangeHandler, priceChangeHandler, submitHandler };
}

export type ITwoValueAdddHandller = (name: string, price: number) => void;

function reducer(state: IModel, action: IActions) {
    let newState = state;
    switch (action.type) {
        case "SetValue":
            newState = {
                ...state,
                item: {
                    value: action.value,
                    invalid: !action.value
                }
            };
            break;
        case "SetPrice":
            newState = {
                ...state,
                price: {
                    value: action.price,
                    invalid: !action.price
                }
            };
            break;
        case "Submit":
            if (state.item.invalid || state.price.invalid) {
                newState = {
                    ...state,
                    showError: true
                };
            } else {
                action.submitSuccess(state.item.value, parseInt(state.price.value));
                newState = init();
            }

            break;
    }
    return newState;
}

function init(): IModel {
    return {
        item: {
            value: "",
            invalid: true,
        },
        price: {
            value: "",
            invalid: true,
        },
        showError: false
    }
}

type IActions = ISetValue | ISetPrice | ISubmit;

interface ISetValue {
    type: "SetValue";
    value: string
}

interface ISetPrice {
    type: "SetPrice";
    price: string
}

interface ISubmit {
    type: "Submit";
    submitSuccess(name: string, price: number): void;
}

interface IModel {
    item: IValueWithValidator;
    price: IValueWithValidator,
    showError: boolean
}

interface IValueWithValidator {
    value: string;
    invalid: boolean
}
