import "./scss/site.scss";
// tslint:disable-next-line:no-submodule-imports
import "moment/locale/hu";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router";
import { createBrowserHistory } from "history";
import "./firebaseInit";

import { Home, Transactions, Wallets, ImportPage, ExportPage, YearlyStatisticsPage, CategoryStatisticsPage, ArticlesPage, MobilPage } from "pages";
import { configureStore } from "store";
import { loadWallets } from "actions/wallets";

const history = createBrowserHistory();
const store = configureStore();

// Preloading global data.
store.dispatch(loadWallets() as any); // TODO: remove when ts problem fixed.

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/transactions/:year?/:month?" component={Transactions} />
                <Route path="/statistics/yearly/:year?" component={YearlyStatisticsPage} />
                <Route path="/statistics/category/:year?" component={CategoryStatisticsPage} />
                <Route path="/statistics/articles" component={ArticlesPage} />
                <Route path="/import" component={ImportPage} />
                <Route path="/export" component={ExportPage} />
                <Route path="/wallets" component={Wallets} />
                <Route path="/mobil" component={MobilPage} />
            </Switch>
        </Router >
    </Provider>,
    document.getElementById("body")
);
