import * as React from 'react';
import { MenuItem } from "./menuItem";
import { DropdownMenu } from './dropdownMenu';
import { Link, NavLink } from 'react-router-dom';
import { bind } from 'helpers';
import { className } from "react-ext";

export namespace Navbar {
    export interface Props {
    }
    export interface State {
        open: boolean;
    }
}

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
                open: !prevState.open,
                animating: true
            };
        });
    }

    render() {
        const { open, } = this.state;
        const closed = !open;
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className={className("navbar-toggler", closed, "collapsed")} type="button"
                    aria-controls="walletNavbar" aria-expanded={open} aria-label="Open main menu" onClick={this.toggleNavbar}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={className("navbar-collapse", "collapse", open, "show")} id="walletNavbar">
                    <ul className="navbar-nav mr-auto">
                        <MenuItem to="/" exact>Home</MenuItem>
                        <MenuItem to="/transactions">Transactions</MenuItem>
                        <DropdownMenu name="Export/Import">
                            <NavLink to="/import" className="dropdown-item" activeClassName="active">Import</NavLink>
                            <NavLink to="/export" className="dropdown-item" activeClassName="active">Export</NavLink>
                        </DropdownMenu>
                        <MenuItem to="/wallets">Wallets</MenuItem>
                    </ul>
                </div>
            </nav>
        );
    }
}