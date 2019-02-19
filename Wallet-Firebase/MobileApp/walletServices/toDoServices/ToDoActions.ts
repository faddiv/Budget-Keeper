import { ToDoListModel } from "./ToDoListModel";
import { ToDoModel } from "./ToDoModel";
import { Action, Dispatch, Reducer, ActionCreator } from "redux";
import { _ } from "helpers";
// tslint:disable:no-submodule-imports
import * as firebase from "firebase/app";
import "firebase/firestore";
// tslint:enable:no-submodule-imports

namespace ToDo {
    export const Add = "ToDo.Add";
    export const Remove = "ToDo.Remove";
}

export const initialState: ToDoListModel = {
    checklist: []
};

export interface ToDoAddResult extends Action<typeof ToDo.Add> {
    success: boolean;
    errorMsg?: string;
    toDoItem?: ToDoModel;
}

interface ToDoRemoveResult extends Action<typeof ToDo.Remove> {
    toDoItem?: ToDoModel;
}

export namespace ToDoServices {
    export const Add = (newToDo: ToDoModel) => {
        return async (dispatch: Dispatch<ToDoAddResult>) => {
            const db = firebase.firestore();
            const userData = db.collection("ToDo");
            const docRef = await userData.add(newToDo);
            const result: ToDoAddResult = {
                type: ToDo.Add,
                success: true,
                toDoItem: {
                    id: docRef.id,
                    userId: newToDo.userId,
                    name: newToDo.name,
                    price: newToDo.price,
                    ok: newToDo.ok
                }
            };
            return dispatch(result);
        };
    };

    export const Remove: ActionCreator<ToDoRemoveResult> = (toDoItem: ToDoModel) => {
        return {
            type: ToDo.Remove,
            toDoItem
        };
    };
}

type ToDoActions = ToDoAddResult | ToDoRemoveResult;

export const toDoReducers: Reducer<ToDoListModel, ToDoActions> = (
    state = initialState,
    action
) => {
    let newState: ToDoListModel;
    switch (action.type) {
        case ToDo.Add:
            {
                if (action.success) {
                    newState = {
                        checklist: [...state.checklist, action.toDoItem]
                    };
                } else {
                    return state;
                }
            }
            break;
        case ToDo.Remove:
            {
                newState = {
                    checklist: _.remove(state.checklist, action.toDoItem)
                };
            }
            break;
        default:
            return state;
            break;
    }
    return {
        ...state,
        ...newState
    };
};
