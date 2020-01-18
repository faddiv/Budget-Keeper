export interface ISharePrice {
    id: number;
    costPerPersons: IPersonCost[];
    sharedPrices: ISharedPrice[];
}

export interface IPersonCost {
    id: number;
    personName: string;
    expense: number;
    details: IDetailElement[];
}

export interface ISharedPrice {
    id: number;
    activityName: string;
    price: number;
    details: IDetailElement[];
}

export interface IDetailElement {
    id: number;
    name: string;
    value: string;
    intValue: number;
    editable: boolean;
}