import { combineReducers } from "redux";
import user, { UserModel } from "./userReducers";

export interface RootState {
    user: UserModel;
}

export const rootReducer = combineReducers<RootState>({
    user
});
