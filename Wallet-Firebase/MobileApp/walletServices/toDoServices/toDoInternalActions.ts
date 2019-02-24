import { Action } from "redux";
import { ToDo } from "./actionNames";

export interface ToDoListModification extends Action<typeof ToDo.Modifications> {
    changes: firebase.firestore.DocumentChange[];
}

export interface ClearListModification extends Action<typeof ToDo.ClearList> {
}

export namespace ToDoInternalServices {
    export function modifications(changes: firebase.firestore.DocumentChange[]): ToDoListModification {
        return {
            type: ToDo.Modifications,
            changes
        };
    }
    export function clearList(): ClearListModification {
        return {
            type: ToDo.ClearList
        };
    }
}
