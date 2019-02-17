import * as React from "react";
import { NavLink } from "react-router-dom";
import * as classNames from "classnames";
import { bind } from "bind-decorator";

import { MenuItem } from "./menuItem";
// import { DropdownMenu } from "./dropdownMenu";
import { Collapse } from "react-ext";
import { UserModel, UserServices } from "../../walletServices/userServices";
import { connect } from "react-redux";
import { RootState } from "walletServices";
import { bindActionCreators } from "redux";

export interface NavbarProps {
    userModel: UserModel;
    userServices?: typeof UserServices;
}

export interface NavbarState {
    open: boolean;
}

class Navbar2 extends React.Component<NavbarProps, NavbarState> {

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
    renderSignedIn() {
        const { userModel, userServices } = this.props;
        return (
            <ul className="navbar-nav">
                <li className="nav-link">{userModel.user.displayName}</li>
                <li className="nav-link"><a onClick={() => userServices.signOut()}>Sign-out</a></li>
            </ul>
        );
    }
    renderLogin() {
        return (
            <ul className="navbar-nav">
                <MenuItem to="/login" exact>Login</MenuItem>
            </ul>
        );
    }
    render() {
        const { open } = this.state;
        const { userModel } = this.props;
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
                    <ul className="navbar-nav">
                        {userModel.singedIn ? this.renderSignedIn() : this.renderLogin()}
                    </ul>
                </Collapse>
            </nav>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        userModel: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userServices: bindActionCreators(UserServices as any, dispatch) as typeof UserServices
    };
}

export const Navbar = connect(mapStateToProps, mapDispatchToProps)(Navbar2);
