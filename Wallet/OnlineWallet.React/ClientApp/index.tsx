import "./scss/site.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Layout } from "./layout";

var history = createBrowserHistory();

ReactDOM.render(
    <BrowserRouter>
        <Layout />
    </BrowserRouter>,
    document.getElementById("body")
);