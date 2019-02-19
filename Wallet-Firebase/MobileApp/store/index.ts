import { createStore, applyMiddleware, Store, compose } from "redux";
import { rootReducer, RootState } from "walletServices";
// tslint:disable:no-submodule-imports
import * as firebase from "firebase/app";
import "firebase/auth";
// tslint:enable:no-submodule-imports
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
    ) as Store<RootState>;

    return store;
}

export const firebaseUiConfig: firebaseui.auth.Config = {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false
    }
};
