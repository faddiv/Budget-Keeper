import * as moment from "moment";
import { dateFormat } from 'app/common/constants';

export interface IRootState {
    readonly homeState: IHomeState
}

export interface IHomeState {
    wallet: string;
    created: string;
    name: string;
    price: string;
    comment: string;
    category: string;
    direction: string;
}

export function createInitialState(): IRootState {
    return {
        homeState: {
            wallet: "2",
            created: moment().format(dateFormat),
            category: "",
            comment: "",
            direction: "-1",
            name: "",
            price: ""
        }
    };
}