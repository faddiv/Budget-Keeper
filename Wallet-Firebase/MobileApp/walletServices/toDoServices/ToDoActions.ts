import { ToDoListModel } from "./ToDoListModel";
import { ToDoModel } from "./ToDoModel";
import { Action, Dispatch, Reducer } from "redux";
import { _ } from "helpers";
// tslint:disable:no-submodule-imports
import * as firebase from "firebase/app";
import "firebase/firestore";
// tslint:enable:no-submodule-imports

namespace ToDo {
    export const Add = "ToDo.Add";
    export const Remove = "ToDo.Remove";
    export const GetAll = "ToDo.GetAll";
}

export const initialState: ToDoListModel = {
    checklist: []
};

export interface ToDoAddResult extends Action<typeof ToDo.Add> {
    success: boolean;
    errorMsg?: string;
    toDoItem?: ToDoModel;
}

interface ToDoRemoveResult extends Action<typeof ToDo.Remove> {
    toDoItem?: ToDoModel;
}

interface GetAllResult extends Action<typeof ToDo.GetAll> {
    toDoItems: ToDoModel[];
}

export namespace ToDoServices {
    export const Add = (newToDo: ToDoModel) => {
        return async (dispatch: Dispatch<ToDoAddResult>) => {
            const db = firebase.firestore();
            const toDoCollection = db.collection("ToDo");
            const docRef = await toDoCollection.add(newToDo);
            const result: ToDoAddResult = {
                type: ToDo.Add,
                success: true,
                toDoItem: {
                    id: docRef.id,
                    userId: newToDo.userId,
                    name: newToDo.name,
                    price: newToDo.price,
                    ok: newToDo.ok
                }
            };
            return dispatch(result);
        };
    };

    export const Remove = (toDoItem: ToDoModel) => {
        return async (dispatch: Dispatch<ToDoRemoveResult>) => {
            if (!toDoItem.id) {
                return Promise.reject("id not provided");
            }
            const db = firebase.firestore();
            const toDoCollection = db.collection("ToDo");
            const doc = toDoCollection.doc(toDoItem.id);
            if (!doc) {
                return Promise.reject("doc not exists");
            }
            await doc.delete();
            return dispatch({
                type: ToDo.Remove,
                toDoItem
            });
        };
    };
    export const GetAll = () => {
        return async (dispatch: Dispatch<GetAllResult>) => {
            const db = firebase.firestore();
            const toDoCollection = db.collection("ToDo");
            const querySnapshot = await toDoCollection.get();
            const checklist = querySnapshot.docs.map(e => {
                const data = e.data();
                return { ...data, id: e.id } as any;
            });
            const result: GetAllResult = {
                type: ToDo.GetAll,
                toDoItems: checklist
            };
            return dispatch(result);
        };
    };
}

type ToDoActions = ToDoAddResult | ToDoRemoveResult | GetAllResult;

export const toDoReducers: Reducer<ToDoListModel, ToDoActions> = (
    state = initialState,
    action
) => {
    let newState: ToDoListModel;
    switch (action.type) {
        case ToDo.Add:
            {
                if (action.success) {
                    newState = {
                        checklist: [...state.checklist, action.toDoItem]
                    };
                } else {
                    return state;
                }
            }
            break;
        case ToDo.Remove:
            {
                newState = {
                    checklist: _.remove(state.checklist, action.toDoItem)
                };
            }
            break;
        case ToDo.GetAll:
            {
                newState = {
                    checklist: action.toDoItems
                };
            }
            break;
        default:
            return state;
            break;
    }
    return {
        ...state,
        ...newState
    };
};
