import { Container } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import { ArticlesPage, CategoryStatisticsPage, Home, ExportPage, ImportPage, Transactions, YearlyStatisticsPage, WalletPage } from "./pages";
import { loadWallets } from "./services/actions/wallets";
import { configureStore } from "./services/store";
import { Provider } from "react-redux";
import { MainMenu, Alerts } from "./components/Layout";
import { TransactionSummary } from "./components/TransactionSummary";

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
            <Route path="/wallets" component={WalletPage} />
          </Switch>
        </Container>
        <TransactionSummary />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
