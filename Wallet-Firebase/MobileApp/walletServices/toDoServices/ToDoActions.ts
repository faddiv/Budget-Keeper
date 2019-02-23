import { ToDoListModel } from "./ToDoListModel";
import { ToDoModel } from "./ToDoModel";
import { Reducer, Dispatch } from "redux";
// tslint:disable:no-submodule-imports
import "firebase/firestore";
// tslint:enable:no-submodule-imports
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
    export const Add = (newToDo: ToDoModel) => {
        return async () => {
            return addInternal(newToDo);
        };
    };

    export const Remove = (toDoItem: ToDoModel) => {
        return removeInternal(toDoItem);
    };
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
    }
    return {
        ...state,
        ...newState
    };
};
