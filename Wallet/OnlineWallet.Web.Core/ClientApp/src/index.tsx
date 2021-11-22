import "./index.scss";
// tslint:disable-next-line:no-submodule-imports
import "moment/locale/hu";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";

import {
  Home,
  Transactions,
  Wallets,
  ImportPage,
  ExportPage,
  YearlyStatisticsPage,
  CategoryStatisticsPage,
  ArticlesPage,
} from "./pages";
import { configureStore } from "./store";
import { loadWallets } from "./actions/wallets";
import { BrowserRouter } from "react-router-dom";

const store = configureStore();

// Preloading global data.
store.dispatch(loadWallets() as any); // TODO: remove when ts problem fixed.

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/transactions/:year?/:month?" component={Transactions} />
        <Route
          path="/statistics/yearly/:year?"
          component={YearlyStatisticsPage}
        />
        <Route
          path="/statistics/category/:year?"
          component={CategoryStatisticsPage}
        />
        <Route path="/statistics/articles" component={ArticlesPage} />
        <Route path="/import" component={ImportPage} />
        <Route path="/export" component={ExportPage} />
        <Route path="/wallets" component={Wallets} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
