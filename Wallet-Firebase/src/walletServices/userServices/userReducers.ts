import { LogoutAction } from "./userActions";
import { LoginAction } from "./userInternals";
import { Reducer } from "redux";
import { UserModel } from "./models";
import * as User from "./actionNames";

const initialState: UserModel = {
    singedIn: false,
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    providerId: null,
    uid: null
};

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
