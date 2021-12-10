import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router";
import { ArticlesPage, CategoryStatisticsPage, HomePage, ExportPage, ImportPage, Transactions, YearlyStatisticsPage, WalletPage } from "./pages";
import { MainMenu, Alerts } from "./components/Layout";
import { TransactionSummary } from "./components/TransactionSummary";

function App() {
  return (
    <>
      <MainMenu />
      <Alerts />
      <Container as="main" role="main">
        <Switch>
          <Route path="/" exact={true} component={HomePage} />
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
    </>
  );
}

export default App;
