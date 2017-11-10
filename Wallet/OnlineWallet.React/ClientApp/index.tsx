import "./scss/site.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import { Home, Transactions, Wallets } from "pages";

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/wallets" component={Wallets} />
        </Switch>
    </BrowserRouter>,
    document.getElementById("body")
);