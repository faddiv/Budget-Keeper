import { ISharePrice, IPersonCost, ISharedPrice, IDetailElement } from './models';
import { useReducer, useMemo } from 'react';
import { _ } from "helpers";

export function usePriceSharing() {
    const [state, dispatch] = useReducer(reducer, 1, init);

    const packedDispatch = useMemo(() => {
        return {
            addPerson(name: string) {
                dispatch({
                    type: "AddPerson",
                    name
                });
            },
            addSharedCost(name: string) {
                dispatch({
                    type: "AddSharedCost",
                    name
                });
            },
            addPersonCost(personCost: IPersonCost, name: string, price: number) {
                dispatch({
                    type: "AddPersonCost",
                    personCost,
                    name,
                    price
                });
            },
            modifyPersonCostById(id, value) {
                const intValue = !value
                    ? 0
                    : parseInt(value);
                dispatch({
                    type: "ModifyPersonCostById",
                    id,
                    intValue,
                    value
                });
            },
            modifyPersonShareById(id, value) {
                const intValue = !value
                    ? 0
                    : fromTime(value);
                dispatch({
                    type: "ModifyPersonShareById",
                    id,
                    intValue,
                    value
                });
            }
        } as IPriceSharingDispatcher
    }, [])
    return {
        state,
        dispatch: packedDispatch
    };
}

export interface IPriceSharingDispatcher {
    addPerson(name: string): void;
    addSharedCost(name: string): void;
    addPersonCost(personCost: IPersonCost, name: string, price: number): void;
    modifyPersonCostById(id: number, rawValue: string): void;
    modifyPersonShareById(id: number, rawValue: string): void;
}

function reducer(state: ISharePrice, action: IActions) {
    let newState = state;
    let id = state.id + 1;
    switch (action.type) {
        case "AddPerson":
            {
                const personCost: IPersonCost = {
                    personName: action.name,
                    details: [],
                    sharedPrices: state.sharedPrices.map<IDetailElement>(e => {
                        return {
                            id: e.id,
                            editable: false,
                            intValue: 0,
                            name: e.activityName,
                            value: ""
                        };
                    }),
                    expense: 0,
                    id
                };
                const sharedPrices: ISharedPrice[] = [];
                for (const sharedPrice of state.sharedPrices) {
                    const intValue = _.max(sharedPrice.details, d => d.intValue) || 1;
                    sharedPrices.push({
                        ...sharedPrice,
                        details: [
                            ...sharedPrice.details,
                            {
                                id: personCost.id,
                                editable: true,
                                intValue: intValue,
                                value: toTime(intValue),
                                name: personCost.personName
                            }
                        ]
                    });
                }
                newState = {
                    id,
                    costPerPersons: [
                        ...state.costPerPersons,
                        personCost
                    ],
                    sharedPrices
                };
                newState = recalculate(newState);
            }
            break;
        case "AddSharedCost":
            {
                const sharedPrices: ISharedPrice[] = [
                    ...state.sharedPrices,
                    {
                        activityName: action.name,
                        price: 0,
                        details: state.costPerPersons.map<IDetailElement>(d => {
                            return {
                                id: d.id,
                                editable: false,
                                intValue: 60,
                                value: toTime(60),
                                name: d.personName
                            };
                        }),
                        id: state.id
                    }
                ];
                newState = {
                    id,
                    sharedPrices,
                    costPerPersons: state.costPerPersons.map<IPersonCost>(e => {
                        return {
                            id: e.id,
                            details: e.details,
                            expense: 0,
                            personName: e.personName,
                            sharedPrices: []
                        };
                    })
                };
                newState = recalculate(newState);
            }
            break;
        case "AddPersonCost":
            newState = {
                sharedPrices: state.sharedPrices,
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
            newState = recalculate(newState);
            break;
        case "ModifyPersonCostById":
            {
                const { person, ownCost } = findPersonWithCostByDetailId(state, action.id);
                if (!person || !ownCost)
                    throw new Error("Person and cost was not found.");

                newState = {
                    ...state,
                    costPerPersons: _.replace(state.costPerPersons, recalculatePerson(person, ownCost, action.intValue, action.value), person)
                };
            }
            break;
        case "ModifyPersonShareById":
            {
                const { personCost, sharedCost } = findShareWhitPersonByDetailId(state, action.id);
                if (!personCost || !sharedCost)
                    throw new Error("Shared element and cost was not found.");
                newState = {
                    ...state,
                    sharedPrices: _.replace(state.sharedPrices, {
                        ...sharedCost,
                        details: _.replace(sharedCost.details, {
                            ...personCost,
                            value: action.value,
                            intValue: action.intValue
                        }, personCost)
                    }, sharedCost)
                };
                newState = recalculate(newState);
            }
            break;
        default:
            break;
    }
    return newState;
}

function init(id: number): ISharePrice {
    return recalculate({
        id: 6,
        costPerPersons: [{
            id: 1,
            personName: "Viktor",
            expense: 10000,
            sharedPrices: [
                {
                    id: 3,
                    name: "Billiárd",
                    value: "",
                    intValue: 0,
                    editable: false
                },
                {
                    id: 4,
                    name: "Darts",
                    value: "",
                    intValue: 0,
                    editable: false
                }
            ],
            details: [
                {
                    id: 5,
                    name: "Étel",
                    value: "1000",
                    intValue: 1000,
                    editable: true
                }
            ]
        }, {
            id: 2,
            personName: "Bea",
            expense: 10000,
            sharedPrices: [
                {
                    id: 3,
                    name: "Billiárd",
                    value: "",
                    intValue: 0,
                    editable: false
                },
                {
                    id: 4,
                    name: "Darts",
                    value: "",
                    intValue: 0,
                    editable: false
                }
            ],
            details: [
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
            id: 3,
            activityName: "Billiárd",
            price: 2000,
            details: [
                {
                    id: 1,
                    editable: true,
                    name: "Viktor",
                    value: "01:30",
                    intValue: 90
                },
                {
                    id: 2,
                    editable: true,
                    name: "Bea",
                    value: "02:00",
                    intValue: 120
                }
            ]
        }, {
            id: 4,
            activityName: "Darts",
            price: 3000,
            details: [
                {
                    id: 1,
                    editable: true,
                    name: "Viktor",
                    value: "01:30",
                    intValue: 90
                },
                {
                    id: 2,
                    editable: true,
                    name: "Bea",
                    value: "02:00",
                    intValue: 120
                }
            ]
        }]
    });
}

function toTime(totalMinutes: number) {
    const hour = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function fromTime(time: string) {
    const parts = time.split(":");
    if (parts.length === 1)
        return parseInt(parts[0]);
    var hour = parseInt(parts[0]);
    var minute = parseInt(parts[1]);
    return hour * 60 + minute;
}

type IActions = IAddPerson | IAddSharedCost | IAddPersonCost | IModifyPersonCostById | IModifyPersonShareById;

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

interface IModifyPersonCostById {
    type: "ModifyPersonCostById";
    id: number;
    intValue: number;
    value: string;
}

interface IModifyPersonShareById {
    type: "ModifyPersonShareById";
    id: number;
    intValue: number;
    value: string;
}

function recalculate(state: ISharePrice): ISharePrice {
    const costPerPersons: IPersonCost[] = recalculateCostPerPersons(state);

    return {
        id: state.id,
        costPerPersons: costPerPersons,
        sharedPrices: state.sharedPrices
    };
}

function recalculateCostPerPersons(state: ISharePrice) {
    const costPerPersons: IPersonCost[] = [];
    for (const personCost of state.costPerPersons) {
        const sharedPrices: IDetailElement[] = [];
        for (const sharedPrice of state.sharedPrices) {
            const sumTime = _.sum(sharedPrice.details, d => d.intValue);
            const personDetail = sharedPrice.details.find(e => e.id === personCost.id);
            if (!personDetail)
                throw new Error("Person detail not found");
            const ownCost = sumTime === 0
                ? 0
                : Math.round(sharedPrice.price * personDetail.intValue / sumTime);
            sharedPrices.push({
                id: sharedPrice.id,
                editable: false,
                name: sharedPrice.activityName,
                intValue: ownCost,
                value: ownCost.toString()
            });
        }
        const expense = personSumExpense(sharedPrices, personCost.details);
        costPerPersons.push({
            id: personCost.id,
            expense: expense,
            personName: personCost.personName,
            details: personCost.details,
            sharedPrices: sharedPrices
        });
    }
    return costPerPersons;
}

function personSumExpense(sharedPrices: IDetailElement[], details: IDetailElement[]) {
    return _.sum(sharedPrices, e => e.intValue)
        + _.sum(details, e => e.intValue);
}

function findPersonWithCostByDetailId(state: ISharePrice, id: number) {
    for (const person of state.costPerPersons) {
        for (const ownCost of person.details) {
            if (ownCost.id === id) {
                return {
                    person,
                    ownCost
                };
            }
        }
    }
    return {}
}

function findShareWhitPersonByDetailId(state: ISharePrice, id: number) {
    for (const sharedCost of state.sharedPrices) {
        for (const personCost of sharedCost.details) {
            if (personCost.id === id) {
                return {
                    sharedCost,
                    personCost
                };
            }
        }
    }
    return {}
}

function recalculatePerson(person: IPersonCost, ownCost: IDetailElement, intValue: number, value: string): IPersonCost {
    const newCost: IDetailElement = {
        ...ownCost,
        intValue,
        value
    }
    const newDetails: IDetailElement[] = _.replace(person.details, newCost, ownCost);
    const expense = personSumExpense(person.sharedPrices, newDetails);
    return {
        ...person,
        details: newDetails,
        expense
    };
}