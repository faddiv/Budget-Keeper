import { IRootState } from "./IRootState";
import { Action } from "redux";
import { Injectable } from "@angular/core";

export function rootReducer(state: IRootState, action: Action) {
    return state;
}

export interface IInitAction extends Action {
    state: any;
}

@Injectable()
export class HomeActions {
    static HOME_INIT = "HOME_INIT";

    constructor() {
        
    }

    init() : IInitAction {
        return {
            type: HomeActions.HOME_INIT,
            state: {}
        }
    }
}