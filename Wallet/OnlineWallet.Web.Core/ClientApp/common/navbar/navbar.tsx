import * as React from 'react';
import { MenuItem } from "./menuItem";
import { DropdownMenu } from 'common/navbar/dropdownMenu';
import { Link, NavLink } from 'react-router-dom';

interface NavbarProps { }

export const Navbar: React.SFC<NavbarProps> = () => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarsExampleDefault">
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
};