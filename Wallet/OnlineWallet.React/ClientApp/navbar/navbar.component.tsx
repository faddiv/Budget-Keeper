import * as React from 'react';
import { Link } from "react-router-dom";
import { MenuItem } from "./menuItem.component";

export class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav mr-auto">
                        <MenuItem to="/" exact>Home <span className="sr-only">(current)</span></MenuItem>
                        <MenuItem to="/transactions">Transactions</MenuItem>
                    </ul>
                </div>
            </nav>
        );
    }
}