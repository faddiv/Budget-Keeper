import "./scss/site.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";
import { Home, Transactions, Wallets } from "pages";

const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/wallets" component={Wallets} />
        </Switch>
    </Router >,
    document.getElementById("body")
);