import { bindActionCreators, Dispatch } from "redux";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { ToDoModel } from "./models";
import { ToDoInternalActions } from "./toDoInternalActions";

let db: firebase.firestore.Firestore;
let toDoListener: () => void;
let toDoInternalActions: typeof ToDoInternalActions;
let toDoCollection: firebase.firestore.CollectionReference;

export function initToDoInternal(dispatch: Dispatch) {
    toDoInternalActions = bindActionCreators(ToDoInternalActions, dispatch);
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
    const model: ToDoModel = { ...toDo };
    delete model.id;
    return doc.update(model);
}

// Omit taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface ToDoDbModel extends Omit<ToDoModel, "checkedDate"> {
    checkedDate: firebase.firestore.Timestamp;
}

export function toDoMapper(change: firebase.firestore.DocumentChange): ToDoModel {
    const model = change.doc.data() as ToDoDbModel;
    return { ...model,
        id: change.doc.id,
        checkedDate: (model.checkedDate && model.checkedDate.toDate()) || null };
}
