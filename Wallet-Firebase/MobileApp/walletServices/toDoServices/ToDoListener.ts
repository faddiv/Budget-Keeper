import { bindActionCreators, Dispatch } from "redux";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { ToDoModel } from "./ToDoModel";
import { ToDoInternalServices } from "./toDoInternalActions";

let db: firebase.firestore.Firestore;
let toDoListener: () => void;
let toDoInternalActions: typeof ToDoInternalServices;
let toDoCollection: firebase.firestore.CollectionReference;

export function initToDoInternal(dispatch: Dispatch) {
    toDoInternalActions = bindActionCreators(ToDoInternalServices, dispatch);
    db = firebase.firestore();
}

export function initToDoListener() {
    toDoCollection = db.collection("ToDo");
    toDoListener = toDoCollection.orderBy("name").onSnapshot(snapshot => {
        const changes = snapshot.docChanges();
        toDoInternalActions.modifications(changes);
    }, error => {
        console.log("Error on toDoListener", error);
    });
}

function ensureInitialized() {
    if (!toDoCollection) {
        throw new Error("initToDoListener doesn't called");
    }
}

export function destroyToDoListener() {
    if (toDoListener) {
        toDoListener();
        toDoListener = undefined;
        toDoCollection = undefined;
        toDoInternalActions.clearList();
    }
}

export function addInternal(toDo: ToDoModel) {
    ensureInitialized();
    return toDoCollection.add(toDo);
}

export function removeInternal(toDo: ToDoModel) {
    ensureInitialized();
    const doc = toDoCollection.doc(toDo.id);
    return doc.delete();
}

export function updateInternal(toDo: ToDoModel) {
    ensureInitialized();
    const doc = toDoCollection.doc(toDo.id);
    return doc.update(toDo);
}
