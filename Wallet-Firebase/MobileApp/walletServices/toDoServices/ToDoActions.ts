import { ToDoListModel } from "./ToDoListModel";
import { ToDoModel } from "./ToDoModel";
import { Action, Dispatch, Reducer, ActionCreator } from "redux";
import { _ } from "helpers";

let testCounter = 1;

export const initialState: ToDoListModel = {
    checklist: []
};

export interface ToDoAddResult extends Action<"ToDo.Add"> {
    success: boolean;
    errorMsg?: string;
    toDoItem?: ToDoModel;
}

interface ToDoRemoveResult extends Action<"ToDo.Remove"> {
    toDoItem?: ToDoModel;
}

export namespace ToDoServices {
    export const Add = (newToDo: ToDoModel) => {
        return async (dispatch: Dispatch<ToDoAddResult>) => {
            const newToDoResult = await new Promise<ToDoModel>((resolve) => {
                setTimeout(() => {
                    const result2: ToDoModel = {
                        ...newToDo,
                        id: (++testCounter).toString()
                    };
                    resolve(result2);
                }, 1000);
            });
            const result: ToDoAddResult = {
                type: "ToDo.Add",
                success: true,
                toDoItem: newToDoResult
            };
            return dispatch(result);
        };
    };

    export const Remove: ActionCreator<ToDoRemoveResult> = (toDoItem: ToDoModel) => {
        return {
            type: "ToDo.Remove",
            toDoItem
        };
    };
}

type ToDoActions = ToDoAddResult | ToDoRemoveResult;

export const toDoList: Reducer<ToDoListModel, ToDoActions> = (
    state = initialState,
    action
) => {
    let newState: ToDoListModel;
    switch (action.type) {
        case "ToDo.Add":
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
        case "ToDo.Remove":
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
