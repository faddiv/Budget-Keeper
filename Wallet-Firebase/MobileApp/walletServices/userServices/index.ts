import { handleActions, createAction } from "redux-actions";
import * as firebase from "firebase";
import { UserModel } from "./UserModel";

namespace UserActions {
    export const setUser = "UserServices.SetUser";
    export const signOut = "UserServices.SignOut";
}

namespace UserServices {
    export const setUser = createAction<firebase.User>(UserActions.setUser);
    export const signOut = createAction(UserActions.signOut);
}

const user = handleActions<UserModel, firebase.User>({
    [UserActions.setUser](state, action) {
        return { ...state, user: action.payload, singedIn: !!action.payload };
    },
    [UserActions.signOut](state) {
        firebase.auth().signOut();
        return state;
    }
}, { singedIn: false });

export {
    UserServices,
    UserModel,
    user
};
