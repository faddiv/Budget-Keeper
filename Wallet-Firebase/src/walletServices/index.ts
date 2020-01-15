import { combineReducers } from "redux";
import { userReducers as user, UserModel } from "./userServices";
import { toDoReducers as toDoList, ToDoListModel } from "./toDoServices";

export interface RootState {
    user: UserModel;
    toDoList: ToDoListModel;
}

export const rootReducer = combineReducers<RootState>({
    user,
    toDoList
});
