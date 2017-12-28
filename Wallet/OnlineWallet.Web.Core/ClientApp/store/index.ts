import { createStore, applyMiddleware, Store, combineReducers, Reducer } from "redux";
import { rootReducer, RootState } from "reducers";
import thunk from "redux-thunk";

export function configureStore(initialState?: RootState) {

    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    ) as Store<RootState>;

    return store;
}
