import * as React from "react";
import { Navbar } from "./common/navbar/navbar.component"
import { Route, Switch } from "react-router-dom";
import { Home, Transactions, Wallets } from "pages";

export class Layout extends React.Component {

    render() {
        return (
            <div>
                <Navbar />
                <main role="main" className="container">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/transactions" component={Transactions} />
                        <Route path="/wallets" component={Wallets} />
                    </Switch>
                </main>
            </div>
        );
    }
}