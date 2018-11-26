import { createAction } from "redux-actions";
import { Actions } from "./actionConstants";

export namespace UserActions {
    export const setUser = createAction<firebase.User>(Actions.setUser);
    export const signOut = createAction(Actions.signOut);
}
