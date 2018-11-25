import * as React from "react";
import { Layout } from "layout";
import * as firebase from "firebase";
import * as firebaseui from "firebaseui";
import { FirebaseAuth } from "react-firebaseui";

const uiConfig: firebaseui.auth.Config = {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
};

export interface HomeProps {
}

export interface HomeState {
    user?: firebase.User;
}

export class Home extends React.Component<HomeProps, HomeState> {
    unregisterAuthObserver: () => void;

    constructor(props) {
        super(props);
        console.log("Home created");
        this.state = {};
    }

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
            console.log("signed in user:", user);
            this.setState({ user });
        });
    }
    renderSignedInUser() {
        const { user } = this.state;
        return (
            <div>
                <p><span>Display name:</span><strong>{user.displayName}</strong></p>
                <p><span>Email:</span><strong>{user.email}</strong></p>
                <p><span>Email verified:</span><strong>{user.emailVerified}</strong></p>
                <p><span>isAnonymous:</span><strong>{user.isAnonymous}</strong></p>
                <p><span>metadata:</span><strong>{JSON.stringify(user.metadata)}</strong></p>
                <p><span>phoneNumber:</span><strong>{user.phoneNumber}</strong></p>
                <p><span>providerData:</span><strong>{JSON.stringify(user.providerData)}</strong></p>
                <p><span>providerId:</span><strong>{user.providerId}</strong></p>
                <p>Photo</p>
                <p><img src={user.photoURL} /></p>
            </div>
        );
    }
    render() {
        const { user } = this.state;
        return (
            <Layout>
                <h1>Hello world!</h1>
                <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                {user ? this.renderSignedInUser() : <div>No user</div>}
            </Layout>
        );
    }
}
