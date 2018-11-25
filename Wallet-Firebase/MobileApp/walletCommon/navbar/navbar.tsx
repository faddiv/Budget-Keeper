import * as React from "react";
import { NavLink } from "react-router-dom";
import * as classNames from "classnames";
import { bind } from "bind-decorator";

import { MenuItem } from "./menuItem";
// import { DropdownMenu } from "./dropdownMenu";
import { Collapse } from "react-ext";

export interface NavbarProps {
}

export interface NavbarState {
    open: boolean;
}

export class Navbar extends React.Component<NavbarProps, NavbarState> {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    @bind
    toggleNavbar() {
        this.setState((prevState) => {
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
                    </ul>
                </Collapse>
            </nav>
        );
    }
}
