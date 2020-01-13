import React from "react";

import { MenuItem } from "./menuItem";
import { UserModel, UserServices } from "../../walletServices/userServices";
import { connect } from "react-redux";
import { RootState } from "../../walletServices";
import { bindActionCreators, Dispatch } from "redux";
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink, NavbarText } from 'reactstrap';

export interface NavbarProps {
    userModel: UserModel;
    userServices?: typeof UserServices;
}

export interface NavbarState {
    open: boolean;
}

class Navbar2 extends React.Component<NavbarProps, NavbarState> {

    constructor(props: NavbarProps) {
        super(props);
        this.state = {
            open: false
        };
    }

    signOut = () => {
        this.props.userServices?.signOut();
    }

    toggleNavbar = () => {
        this.setState((prevState) => {
            return {
                open: !prevState.open
            };
        });
    }

    renderSignedIn() {
        const { userModel } = this.props;
        return (
            <Nav navbar>
                <NavItem>
                    <NavbarText>{userModel.displayName}</NavbarText>
                </NavItem>
                <NavItem>
                    <NavLink color="link" onClick={this.signOut}>Sign-out</NavLink>
                </NavItem>
            </Nav>
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
        return (
            <Navbar color="dark" dark expand="md" fixed="top">
                <NavbarBrand href="/">Wallet</NavbarBrand>
                <NavbarToggler onClick={this.toggleNavbar} />
                <Collapse isOpen={open} navbar id="walletNavbar">
                    <Nav className="mr-auto" navbar>
                        <MenuItem to="/" exact>Home</MenuItem>
                        <MenuItem to="/sharedPrices" exact>Share prices</MenuItem>
                    </Nav>
                    <Nav navbar>
                        {userModel.singedIn ? this.renderSignedIn() : this.renderLogin()}
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        userModel: state.user
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return {
        userServices: bindActionCreators(UserServices as any, dispatch) as typeof UserServices
    };
}

export const WalletNavbar = connect(mapStateToProps, mapDispatchToProps)(Navbar2);
