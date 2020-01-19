import { ISharePrice, IPersonCost, IDetailElement, ISharedPrice } from './models';
import { useReducer, useCallback } from 'react';
import { _ } from "helpers";

export function usePriceSharing() {
    const [state, dispatch] = useReducer(reducer, 1, init);

    const addPerson = useCallback((name: string) => {
        dispatch({ type: "AddPerson", name });
    }, []);

    const addSharedCost = useCallback((name: string) => {
        dispatch({ type: "AddSharedCost", name });
    }, []);

    const addPersonCost = useCallback((personCost: IPersonCost, name: string, price: number) => {
        dispatch({ type: "AddPersonCost", personCost, name, price });
    }, []);
    return {
        state,
        dispatch: {
            addPerson,
            addSharedCost,
            addPersonCost
        } as IPriceSharingDispatcher
    };
}

export interface IPriceSharingDispatcher {
    addPerson(name: string): void;
    addSharedCost(name: string): void;
    addPersonCost(personCost: IPersonCost, name: string, price: number): void;
}

function reducer(state: ISharePrice, action: IActions) {
    let newState = state;
    switch (action.type) {
        case "AddPerson":
            newState = {
                ...state,
                id: state.id + 1,
                costPerPersons: [
                    ...state.costPerPersons,
                    {
                        personName: action.name,
                        details: [],
                        expense: 0,
                        id: state.id
                    }
                ]
            };
            break;
        case "AddSharedCost":
            newState = {
                ...state,
                id: state.id + 1,
                sharedPrices: [
                    ...state.sharedPrices,
                    {
                        activityName: action.name,
                        price: 0,
                        details: [],
                        id: state.id
                    }
                ]
            };
            break;
        case "AddPersonCost":

            newState = {
                ...state,
                id: state.id + 1,
                costPerPersons: _.replace(state.costPerPersons, {
                    ...action.personCost,
                    details: [...action.personCost.details, {
                        id: state.id + 1,
                        name: action.name,
                        intValue: action.price,
                        value: action.price.toString(),
                        editable: true
                    }]
                }, action.personCost)
            };
            break;
        default:
            break;
    }
    return newState;
}

function init(id: number): ISharePrice {
    return {
        id: id,
        costPerPersons: [{
            id: 3,
            personName: "Viktor",
            expense: 10000,
            details: [
                {
                    id: 1,
                    name: "Billiárd",
                    value: "1000",
                    intValue: 1000,
                    editable: false
                },
                {
                    id: 2,
                    name: "Étel",
                    value: "1000",
                    intValue: 1000,
                    editable: true
                }
            ]
        }, {
            id: 4,
            personName: "Bea",
            expense: 10000,
            details: [
                {
                    id: 5,
                    name: "Billiárd",
                    value: "1000",
                    intValue: 1000,
                    editable: false
                },
                {
                    id: 6,
                    name: "Étel",
                    value: "1000",
                    intValue: 1000,
                    editable: true
                }
            ]
        }],
        sharedPrices: [{
            id: 8,
            activityName: "Billiárd",
            price: 2000,
            details: [
                {
                    id: 9,
                    editable: true,
                    name: "Viktor",
                    value: "01:30",
                    intValue: 90
                },
                {
                    id: 10,
                    editable: true,
                    name: "Bea",
                    value: "02:00",
                    intValue: 120
                }
            ]
        }, {
            id: 11,
            activityName: "Darts",
            price: 3000,
            details: [
                {
                    id: 12,
                    editable: true,
                    name: "Viktor",
                    value: "01:30",
                    intValue: 90
                },
                {
                    id: 13,
                    editable: true,
                    name: "Bea",
                    value: "02:00",
                    intValue: 120
                }
            ]
        }]
    }
}

type IActions = IAddPerson | IAddSharedCost | IAddPersonCost;

interface IAddPerson {
    type: "AddPerson";
    name: string;
}

interface IAddSharedCost {
    type: "AddSharedCost";
    name: string;
}

interface IAddPersonCost {
    type: "AddPersonCost";
    personCost: IPersonCost;
    name: string;
    price: number;
}