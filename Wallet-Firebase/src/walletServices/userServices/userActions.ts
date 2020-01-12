import { Action, Dispatch } from "redux";
import * as User from "./actionNames";
import { signOutInternal, initAuthInternal } from "./userInternals";

export interface LogoutAction extends Action<typeof User.signOut> {
}

export const UserServices = {

    signOut() {
        return signOutInternal;
    }
}

export function initUserServices(dispatch: Dispatch) {
    initAuthInternal(dispatch);
}
