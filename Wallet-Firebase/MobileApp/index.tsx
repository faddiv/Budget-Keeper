import "./scss/site.scss";
import "moment/locale/hu";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";

import { configureStore } from "store";
import { Home, Login } from "pages";
import { UserServices } from "./walletServices/userServices";
import { AuthenticatedRoute } from "walletCommon";
import { initToDoListener } from "./walletServices/toDoServices";

const config = {
    apiKey: "AIzaSyDdlgWpHPzu1-9O8KQSex9tut2CndYHnT4",
    authDomain: "budget-keeper-8f45b.firebaseapp.com",
    projectId: "budget-keeper-8f45b"
};

firebase.initializeApp(config);
firebase.firestore().settings({
    timestampsInSnapshots: true
});

const history = createBrowserHistory();
const store = configureStore();

this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
    console.log("signed in user:", user);
    store.dispatch(UserServices.setUser(user));
});

initToDoListener(store.dispatch);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <AuthenticatedRoute path="/" exact component={Home} />
                <Route path="/login" component={Login} />
            </Switch>
        </Router >
    </Provider>,
    document.getElementById("body")
);
