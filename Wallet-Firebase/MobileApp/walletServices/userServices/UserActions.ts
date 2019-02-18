import { Action, Reducer, ActionCreator } from "redux";
import * as firebase from "firebase";
import { UserModel } from "./UserModel";

namespace User {
    export const setUser = "User.setUser";
    export const signOut = "User.signOut";
}

const initialState: UserModel = {
    singedIn: false,
    user: null
};

export interface LoginAction extends Action<typeof User.setUser> {
    user: firebase.User;
}

export interface LogoutAction extends Action<typeof User.signOut> {
}

export namespace UserServices {
    export const setUser: ActionCreator<LoginAction> = (fbUser: firebase.User) => {
        return {
            type: User.setUser,
            user: fbUser
        };
    };
    export const signOut: ActionCreator<LogoutAction> = () => {
        return {
            type: User.signOut
        };
    };
}

type UserActions = LoginAction | LogoutAction;

export const userReducers: Reducer<UserModel, UserActions> = (
    state = initialState,
    action
) => {
    let newState: UserModel;
    switch (action.type) {
        case User.setUser:
            newState = {
                singedIn: !!action.user,
                user: action.user
            };
            break;
        case User.signOut:
            firebase.auth().signOut();
            return state;
        default:
            return state;
    }
    return {
        ...state,
        ...newState
    };
};
