import * as React from "react";
import { NavLink } from "react-router-dom";
import * as classNames from "classnames";
import { bind } from "bind-decorator";

import { MenuItem } from "./menuItem";
// import { DropdownMenu } from "./dropdownMenu";
import { Collapse } from "react-ext";
import { UserModel } from "reducers/userReducers";
import { connect } from "react-redux";
import { RootState } from "reducers";
import { UserActions } from "actions/userActions";
import { bindActionCreators } from "redux";

export interface NavbarProps {
    userModel: UserModel;
    actions?: typeof UserActions;
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
        const { userModel, actions } = this.props;
        return (
            <ul className="navbar-nav">
                <li className="nav-link">{userModel.user.displayName}</li>
                <li className="nav-link"><a onClick={() => actions.signOut()}>Sign-out</a></li>
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
        actions: bindActionCreators(UserActions as any, dispatch) as typeof UserActions
    };
}

export const Navbar = connect(mapStateToProps, mapDispatchToProps)(Navbar2);
