import * as firebase from "firebase/app";
import "firebase/auth";
import { Dispatch, Action } from "redux";
import { User } from "./actionNames";
import { UserModel } from "./UserModel";

let auth: firebase.auth.Auth;
let unregisterAuthObserver: () => void;

export interface LoginAction extends Action<typeof User.setUser> {
    user: UserModel;
}

namespace UserInternalActions {
    export function setUser(user: firebase.UserInfo): LoginAction {
        if (!user) {
            return {
                type: User.setUser,
                user: {
                    displayName: null,
                    email: null,
                    phoneNumber: null,
                    photoURL: null,
                    providerId: null,
                    uid: null,
                    singedIn: !!user
                }
            };
        }
        return {
            type: User.setUser,
            user: {
                displayName: user.displayName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                providerId: user.providerId,
                uid: user.uid,
                singedIn: !!user
            }
        };
    }
}

export function initAuthInternal(dispatch: Dispatch) {
    auth = firebase.auth();
    unregisterAuthObserver = auth.onAuthStateChanged((user) => {
        console.log("signed in user:", user);
        dispatch(UserInternalActions.setUser(user));
    });
}

export function destroyAuthInternal() {
    unregisterAuthObserver();
}

export function signOutInternal() {
    return auth.signOut();
}
