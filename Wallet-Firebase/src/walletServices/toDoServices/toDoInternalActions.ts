import { Action } from "redux";
import * as ToDo from "./actionNames";

export interface ToDoListModification extends Action<typeof ToDo.Modifications> {
    changes: firebase.firestore.DocumentChange[];
}

export interface ClearListModification extends Action<typeof ToDo.ClearList> {
}

export const ToDoInternalActions = {
    modifications(changes: firebase.firestore.DocumentChange[]): ToDoListModification {
        return {
            type: ToDo.Modifications,
            changes
        };
    },
    clearList(): ClearListModification {
        return {
            type: ToDo.ClearList
        };
    }
}
