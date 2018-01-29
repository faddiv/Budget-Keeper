import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import * as classNames from "classnames";
import { MenuItem } from "./menuItem";
import { DropdownMenu } from "./dropdownMenu";
import { bind } from "helpers";
import { Collapse } from "react-ext";

export namespace Navbar {
    export interface Props {
    }
    export interface State {
        open: boolean;
    }
}

const statusStyle = {
    entering: { height: 200 },
    entered: { height: 200 },
    exiting: { height: 0 },
    exited: { height: 0 }
};

export class Navbar extends React.Component<Navbar.Props, Navbar.State> {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    @bind
    toggleNavbar() {
        this.setState((prevState, props) => {
            return {
                open: !prevState.open
            };
        });
    }

    render() {
        const { open } = this.state;
        const collapsed = !open;
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                <NavLink to="/" className="navbar-brand" exact>Wallet</NavLink>
                <button className={classNames("navbar-toggler", { collapsed })} type="button"
                    aria-controls="walletNavbar" aria-expanded={open} aria-label="Open main menu" onClick={this.toggleNavbar}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Collapse open={open} className="navbar-collapse" id="walletNavbar">
                    <ul className="navbar-nav mr-auto">
                        <MenuItem to="/" exact>Home</MenuItem>
                        <MenuItem to="/transactions">Transactions</MenuItem>
                        <DropdownMenu name="Statistics">
                            <NavLink to="/statistics/yearly" className="dropdown-item" activeClassName="active">Yearly statistics</NavLink>
                            <NavLink to="/statistics/category" className="dropdown-item" activeClassName="active">Category statistics</NavLink>
                            <NavLink to="/statistics/articles" className="dropdown-item" activeClassName="active">Articles</NavLink>
                        </DropdownMenu>
                        <DropdownMenu name="Export/Import">
                            <NavLink to="/import" className="dropdown-item" activeClassName="active">Import</NavLink>
                            <NavLink to="/export" className="dropdown-item" activeClassName="active">Export</NavLink>
                        </DropdownMenu>
                        <MenuItem to="/wallets">Wallets</MenuItem>
                    </ul>
                </Collapse>
            </nav>
        );
    }
}
