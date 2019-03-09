import { MobileSyncModel } from "./models";
import { SetStateAction } from "./internalActions";
import { Reducer } from "redux";
import { MobileSync } from "./actionNames";

const initialState: MobileSyncModel = {
    state: null
};

type AllActions = SetStateAction;

export const reducers: Reducer<MobileSyncModel, AllActions> = (
    state = initialState,
    action
) => {
    let newState: MobileSyncModel;
    switch (action.type) {
        case MobileSync.SetState:
            newState = {
                state: action.state
            };
            break;
        default:
            return state;
            break;
    }
    return {
        ...state,
        ...newState
    };
};
