import { handleActions } from "redux-actions";
import * as firebase from "firebase";
import { Actions } from "actions/actionConstants";

export interface UserModel {
    user?: firebase.User;
    singedIn: boolean;
}

export default handleActions<UserModel, firebase.User>({
    [Actions.setUser](state, action) {
        return { ...state, user: action.payload, singedIn: !!action.payload };
    },
    [Actions.signOut](state) {
        firebase.auth().signOut();
        return state;
    }
}, { singedIn: false });
