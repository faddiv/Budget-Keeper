import { combineReducers } from "redux";
import { user, UserModel } from "./userServices";
import { buyList, BuyListModel } from "./itemsServices";

export interface RootState {
    user: UserModel;
    buyList: BuyListModel;
}

export const rootReducer = combineReducers<RootState>({
    user,
    buyList
});
