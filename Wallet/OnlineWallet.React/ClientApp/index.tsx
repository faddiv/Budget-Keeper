import "./scss/site.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";
import { Home, Transactions, Wallets, ImportPage, ExportPage } from "pages";
import { configureStore } from "store";
import { loadWallets } from "actions/wallets";

const history = createBrowserHistory();
const store = configureStore();

//Preloading global data.
store.dispatch(loadWallets());

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/transactions" component={Transactions} />
                <Route path="/import" component={ImportPage} />
                <Route path="/export" component={ExportPage} />
                <Route path="/wallets" component={Wallets} />
            </Switch>
        </Router >
    </Provider>,
    document.getElementById("body")
);