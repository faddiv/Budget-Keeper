import { Action } from "redux";
import { ToDo } from "./actionNames";

export interface ToDoListModification extends Action<typeof ToDo.Modifications> {
    changes: firebase.firestore.DocumentChange[];
}

export namespace ToDoInternalServices {
    export function modifications(changes: firebase.firestore.DocumentChange[]): ToDoListModification {
        return {
            type: ToDo.Modifications,
            changes
        };
    }
}
