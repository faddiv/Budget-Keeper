import "./site.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Router, Switch } from "react-router";
import { Layout } from "./layout";

ReactDOM.render(
    <Layout />,
    document.getElementById("body")
);