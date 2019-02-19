import * as React from "react";
import { Layout } from "layout";
// tslint:disable:no-submodule-imports
import * as firebase from "firebase/app";
import "firebase/auth";
// tslint:enable:no-submodule-imports
import { FirebaseAuth } from "react-firebaseui";
import { UserModel, UserServices } from "../../walletServices/userServices";
import { RootState } from "walletServices";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { firebaseUiConfig } from "store";
import { RouteComponentProps } from "react-router";

export interface LoginProps extends Partial<RouteComponentProps<any>> {
    userModel: UserModel;
    actions?: typeof UserServices;
}

export interface LoginState {
}

class Login2 extends React.Component<LoginProps, LoginState> {
    unregisterAuthObserver: () => void;

    constructor(props) {
        super(props);
        console.log("Home created");
        this.state = {};
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
            if (user && this.props.location.search) {
                const search = new URLSearchParams(this.props.location.search);
                const returnUrl = search.get("returnUrl");
                if (returnUrl) {
                    this.props.history.push(returnUrl);
                }
            }
        });
    }

    componentWillUnmount() {
        if (this.unregisterAuthObserver) {
            this.unregisterAuthObserver();
        }
    }

    renderSignedInUser() {
        const { userModel, actions } = this.props;
        const { user } = userModel;
        return (
            <div>
                <a onClick={() => actions.signOut()}>Sign-out</a>
                <p><span>Display name:</span><strong>{user.displayName}</strong></p>
                <p><span>Email:</span><strong>{user.email}</strong></p>
                <p><span>Email verified:</span><strong>{user.emailVerified}</strong></p>
                <p><span>isAnonymous:</span><strong>{user.isAnonymous}</strong></p>
                <p><span>metadata:</span><strong>{JSON.stringify(user.metadata)}</strong></p>
                <p><span>phoneNumber:</span><strong>{user.phoneNumber}</strong></p>
                <p><span>providerData:</span><strong>{JSON.stringify(user.providerData)}</strong></p>
                <p><span>id:</span><span>{user.uid}</span></p>
                <p><span>providerId:</span><strong>{user.providerId}</strong></p>
                <p>Photo</p>
                <p><img src={user.photoURL} /></p>
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(UserServices as any, dispatch) as typeof UserServices
    };
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(Login2);
