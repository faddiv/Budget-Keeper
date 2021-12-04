import { createStore, applyMiddleware, compose } from "redux";
import { rootReducer, RootState } from "../reducers";
import thunk from "redux-thunk";

export function configureStore(initialState?: RootState) {

    let compose2 = compose;
    if (process.env.NODE_ENV !== "production") {
        compose2 = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }

    const store = createStore(
        rootReducer,
        initialState,
        compose2(applyMiddleware(thunk))
    );

    return store;
}
