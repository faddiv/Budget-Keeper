import { Container } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import { ArticlesPage, CategoryStatisticsPage, Home, ExportPage, ImportPage, Transactions, Wallets, YearlyStatisticsPage } from "./pages";
import { Alerts, MainMenu, TransactionSummary } from "./walletCommon";
import { loadWallets } from "./actions/wallets";
import { configureStore } from "./store";
import { Provider } from "react-redux";

const store = configureStore();

// Preloading global data.
store.dispatch(loadWallets() as any); // TODO: remove when ts problem fixed.

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MainMenu />
        <Alerts />
        <Container as="main" role="main">
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/transactions/:year?/:month?" component={Transactions} />
            <Route path="/statistics/yearly/:year?" component={YearlyStatisticsPage} />
            <Route path="/statistics/category/:year?" component={CategoryStatisticsPage} />
            <Route path="/statistics/articles" component={ArticlesPage} />
            <Route path="/import" component={ImportPage} />
            <Route path="/export" component={ExportPage} />
            <Route path="/wallets" component={Wallets} />
          </Switch>
        </Container>
        <TransactionSummary />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
