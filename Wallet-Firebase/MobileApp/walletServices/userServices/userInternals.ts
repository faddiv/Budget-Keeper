import * as firebase from "firebase/app";
import "firebase/auth";
import { Dispatch, Action } from "redux";
import * as User from "./actionNames";
import { UserModel } from "./models";

let auth: firebase.auth.Auth;
let unregisterAuthObserver: () => void;

export interface LoginAction extends Action<typeof User.setUser> {
    user: UserModel;
}

const UserInternalActions = {
    setUser(user: firebase.UserInfo | null): LoginAction {
        user = user || { displayName: null, email: null, phoneNumber: null, photoURL: null, providerId: "firebase", uid: ""};
        const { displayName, email, phoneNumber, photoURL, providerId, uid } = user;
        return {
            type: User.setUser,
            user: {
                displayName,
                email,
                phoneNumber,
                photoURL,
                providerId,
                uid,
                singedIn: !!uid
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
