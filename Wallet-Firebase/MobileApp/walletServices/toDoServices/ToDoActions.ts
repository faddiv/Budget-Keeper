import { ToDoListModel } from "./ToDoListModel";
import { ToDoModel } from "./ToDoModel";
import { Reducer, Dispatch } from "redux";
import { addInternal, removeInternal, initToDoInternal } from "./ToDoListener";
import { ToDoListModification } from "./toDoInternalActions";
import { ToDo } from "./actionNames";

function toDoMapper(change: firebase.firestore.DocumentChange): ToDoModel {
    const model = change.doc.data() as ToDoModel;
    model.id = change.doc.id;
    return model;
}

export const initialState: ToDoListModel = {
    checklist: []
};

export function initToDoListener(dispatch: Dispatch) {
    initToDoInternal(dispatch);
}

export namespace ToDoServices {
    export function add(newToDo: ToDoModel) {
        return () => {
            return addInternal(newToDo);
        };
    }

    export function remove(toDoItem: ToDoModel) {
        return () => {
            return removeInternal(toDoItem);
        };
    }
}

type ToDoActions = ToDoListModification;

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
        default:
            return state;
    }
    return {
        ...state,
        ...newState
    };
};
