import { ToDoModel } from "./models";
import { Dispatch } from "redux";
import { addInternal, removeInternal, updateInternal, initToDoInternal, initToDoListener, destroyToDoListener } from "./toDoInternals";

export function initToDoServices(dispatch: Dispatch) {
    initToDoInternal(dispatch);
}

export function listenToDos() {
    initToDoListener();
    return destroyToDoListener;
}

export const ToDoActions = {
    add(newToDo: ToDoModel) {
        return () => {
            return addInternal(newToDo);
        };
    },

    remove(toDoItem: ToDoModel) {
        return () => {
            return removeInternal(toDoItem);
        };
    },

    update(toDo: ToDoModel) {
        return () => {
            return updateInternal(toDo);
        };
    }
}
