import { combineReducers } from "redux";
import { user, UserModel } from "./userServices";
import { toDoList, ToDoListModel } from "./toDoServices";

export interface RootState {
    user: UserModel;
    toDoList: ToDoListModel;
}

export const rootReducer = combineReducers<RootState>({
    user,
    toDoList
});
