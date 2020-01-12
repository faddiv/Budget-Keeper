import React from "react";
import { Layout } from "../../layout";
// tslint:disable:no-submodule-imports
import * as firebase from "firebase/app";
import "firebase/auth";
// tslint:enable:no-submodule-imports
import { FirebaseAuth } from "react-firebaseui";
import { UserServices } from "../../walletServices/userServices";
import { RootState } from "../../walletServices";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { firebaseUiConfig } from "../../store";
import { RouteComponentProps } from "react-router";

export interface LoginProps extends Partial<RouteComponentProps<any>>, ReturnType<typeof mapDispatchToProps>, ReturnType<typeof mapStateToProps> {
}

export interface LoginState {
}

class Login2 extends React.Component<LoginProps, LoginState> {

    constructor(props: LoginProps) {
        super(props);
        console.log("Home created");
        this.state = {};
    }

    componentDidUpdate(prevProps: LoginProps) {
        if (!prevProps.userModel.singedIn && this.props.userModel.singedIn) {
            if (this.props.location && this.props.history) {
                const search = new URLSearchParams(this.props.location.search);
                const returnUrl = search.get("returnUrl");
                if (returnUrl) {
                    this.props.history.push(returnUrl);
                }
            }
        }
    }

    renderSignedInUser() {
        const { userModel, actions } = this.props;
        return (
            <div>
                <a onClick={() => actions.signOut()}>Sign-out</a>
                <p><span>Display name:</span><strong>{userModel.displayName}</strong></p>
                <p><span>Email:</span><strong>{userModel.email}</strong></p>
                <p><span>phoneNumber:</span><strong>{userModel.phoneNumber}</strong></p>
                <p><span>id:</span><span>{userModel.uid}</span></p>
                <p><span>providerId:</span><strong>{userModel.providerId}</strong></p>
                <p>Photo</p>
                <p><img src={userModel.photoURL || undefined} /></p>
            </div>
        );
    }
    render() {
        const { userModel } = this.props;
        return (
            <Layout>
                <h1>Please login</h1>
                {userModel.singedIn ? this.renderSignedInUser() : <FirebaseAuth uiConfig={firebaseUiConfig} firebaseAuth={firebase.auth()} />}
            </Layout>
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
        actions: bindActionCreators(UserServices, dispatch)
    };
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(Login2);
