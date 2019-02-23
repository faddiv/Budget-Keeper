import { bindActionCreators, Dispatch } from "redux";
// tslint:disable:no-submodule-imports
import * as firebase from "firebase/app";
import "firebase/firestore";
// tslint:enable:no-submodule-imports
import { ToDoModel } from "./ToDoModel";
import { ToDoInternalServices } from "./toDoInternalActions";
let db: firebase.firestore.Firestore;
let toDoCollection: firebase.firestore.CollectionReference;
let toDoListener: () => void;
let toDoInternalActions: typeof ToDoInternalServices;

export function initToDoInternal(dispatch: Dispatch) {
    toDoInternalActions = bindActionCreators(ToDoInternalServices, dispatch);
    db = firebase.firestore();
    toDoCollection = db.collection("ToDo");
    toDoListener = toDoCollection.orderBy("name").onSnapshot(snapshot => {
        const changes = snapshot.docChanges();
        toDoInternalActions.modifications(changes);
    }, error => {
        console.log("Error on toDoListener", error);
    });
}

export function destroyToDoListener() {
    if (toDoListener) {
        toDoListener();
        toDoListener = undefined;
    }
}

export function addInternal(toDo: ToDoModel) {
    return toDoCollection.add(toDo);
}

export function removeInternal(toDo: ToDoModel) {
    const doc = toDoCollection.doc(toDo.id);
    return doc.delete();
}

export function updateInternal(toDo: ToDoModel) {
    const doc = toDoCollection.doc(toDo.id);
    return doc.update(toDo);
}
