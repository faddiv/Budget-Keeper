import * as React from "react";
import { Navbar } from "./navbar/navbar.component"
import { Route, Switch } from "react-router-dom";
import { Home } from "./home/home.component";
import { Transactions } from "./transactions/transactions.component";

export class Layout extends React.Component {

    render() {
        return (
            <div>
                <Navbar />
                <main role="main" className="container">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/transactions" component={Transactions} />
                    </Switch>
                </main>
            </div>
        );
    }
}