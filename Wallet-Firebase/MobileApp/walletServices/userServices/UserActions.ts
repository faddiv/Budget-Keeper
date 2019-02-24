import { Action, Dispatch } from "redux";
import { User } from "./actionNames";
import { signOutInternal, initAuthInternal } from "./userInternals";

export interface LogoutAction extends Action<typeof User.signOut> {
}

export namespace UserServices {

    export function signOut() {
        return signOutInternal;
    }
}

export function initUserServices(dispatch: Dispatch) {
    initAuthInternal(dispatch);
}
