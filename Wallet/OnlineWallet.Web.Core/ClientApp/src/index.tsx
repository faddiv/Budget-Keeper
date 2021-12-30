import "./index.scss";
import "moment/locale/hu";
import { render } from "react-dom";
import { configureStore } from "./services/store";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { loadWallets } from "./services/actions/wallets";

const store = configureStore();

// Preloading global data.
store.dispatch(loadWallets() as any); // TODO: remove when ts problem fixed.

render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
