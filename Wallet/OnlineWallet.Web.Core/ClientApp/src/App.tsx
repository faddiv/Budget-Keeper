import { Container } from "react-bootstrap";
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import {
  ArticlesPage,
  CategoryStatisticsPage,
  Home,
  ExportPage,
  ImportPage,
  Transactions,
  Wallets,
  YearlyStatisticsPage,
} from "./pages";
import { MainMenu } from "./walletCommon";

function App() {
  return (
    <BrowserRouter>
      <MainMenu />
      <Container className="main" as="main" role="main">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/transactions/:year?/:month?" component={Transactions} />
          <Route path="/statistics">
            <Route path="/yearly/:year?" component={YearlyStatisticsPage} />
            <Route path="/category/:year?" component={CategoryStatisticsPage} />
            <Route path="/articles" component={ArticlesPage} />
          </Route>
          <Route path="/import" component={ImportPage} />
          <Route path="/export" component={ExportPage} />
          <Route path="/wallet" component={Wallets} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

export default App;
