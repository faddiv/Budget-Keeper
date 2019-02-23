import { Action, Reducer, Dispatch } from "redux";
import { UserModel } from "./UserModel";
import { User } from "./actionNames";
import { signOutInternal, LoginAction, initAuthInternal } from "./userServiceInternals";

const initialState: UserModel = {
    singedIn: false,
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    providerId: null,
    uid: null
};

export interface LogoutAction extends Action<typeof User.signOut> {
}

export namespace UserServices {

    export function signOut() {
        return signOutInternal;
    }
}

type UserActions = LogoutAction | LoginAction;

export const userReducers: Reducer<UserModel, UserActions> = (
    state = initialState,
    action
) => {
    let newState: UserModel;
    switch (action.type) {
        case User.setUser:
            newState = action.user;
            break;
        default:
            return state;
    }
    return {
        ...state,
        ...newState
    };
};

export function initUserServices(dispatch: Dispatch) {
    initAuthInternal(dispatch);
}
