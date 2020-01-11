import "./scss/site.scss";
import "moment/locale/hu";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";
import "./firebaseInit";
import "./serviceWorkerInstall";

import { configureStore } from "store";
import { Home, Login, SharePrices } from "pages";
import { initUserServices } from "./walletServices/userServices";
import { AuthenticatedRoute } from "walletCommon";
import { initToDoServices } from "./walletServices/toDoServices";

const history = createBrowserHistory();
const store = configureStore();

initUserServices(store.dispatch);
initToDoServices(store.dispatch);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <AuthenticatedRoute path="/" exact component={Home} />
                <AuthenticatedRoute path="/sharedPrices" exact component={SharePrices} />
                <Route path="/login" component={Login} />
            </Switch>
        </Router >
    </Provider>,
    document.getElementById("body")
);
