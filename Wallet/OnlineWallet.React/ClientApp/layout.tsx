import * as React from "react";
import { Navbar } from "./navbar/navbar.component"
import { Home } from "./home/home.component";

export class Layout extends React.Component {
    counter() {
        var items = [];
        for (var index = 0; index < 10; index++) {
            items.push(index);
        }
        return items;
    }
    render() {
        return (
            <div>
                <Navbar />
                <main role="main" className="container">
                    <Home />
                </main>
            </div>
        );
    }
}