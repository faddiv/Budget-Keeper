import { ToDoListModification, ClearListModification } from "./toDoInternalActions";
import { Reducer } from "redux";
import { ToDoListModel } from "./models";
import { ToDo } from "./actionNames";
import { toDoMapper } from "./toDoInternals";

export const initialState: ToDoListModel = {
    checklist: []
};

type ToDoActions = ToDoListModification | ClearListModification;

export const toDoReducers: Reducer<ToDoListModel, ToDoActions> = (
    state = initialState,
    action
) => {
    let newState: ToDoListModel;
    switch (action.type) {
        case ToDo.Modifications:
            {
                const checklist = [...state.checklist];
                action.changes.forEach(change => {
                    switch (change.type) {
                        case "added":
                            checklist.splice(change.newIndex, 0, toDoMapper(change));
                            break;
                        case "modified":
                            if (change.newIndex === change.oldIndex) {
                                checklist.splice(change.newIndex, 1, toDoMapper(change));
                            } else {
                                checklist.splice(change.oldIndex, 1);
                                checklist.splice(change.newIndex, 0, toDoMapper(change));
                            }
                            break;
                        case "removed":
                            checklist.splice(change.oldIndex, 1);
                            break;
                    }
                });
                newState = { checklist };
            }
            break;
        case ToDo.ClearList:
            {
                newState = { checklist: [] };
            }
            break;
        default:
            return state;
    }
    return {
        ...state,
        ...newState
    };
};
