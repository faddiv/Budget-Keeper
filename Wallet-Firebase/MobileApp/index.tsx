import "./scss/site.scss";
// tslint:disable-next-line:no-submodule-imports
import "moment/locale/hu";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";

import { configureStore } from "store";
import { Home } from "pages";

const history = createBrowserHistory();
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={Home} />
            </Switch>
        </Router >
    </Provider>,
    document.getElementById("body")
);
