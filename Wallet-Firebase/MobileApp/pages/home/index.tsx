import * as React from "react";
import { Layout } from "layout";
import { UserModel } from "reducers/userReducers";
import { RootState } from "reducers";
import { UserActions } from "actions/userActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

export interface HomeProps {
    userModel: UserModel;
    actions?: typeof UserActions;
}

export interface HomeState {
}

class Home2 extends React.Component<HomeProps, HomeState> {
    unregisterAuthObserver: () => void;

    constructor(props) {
        super(props);
        console.log("Home created");
        this.state = {};
    }

    componentDidMount() {
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
                <p><span>id:</span><span>{user.providerData[0].uid}</span></p>
                <p><span>providerId:</span><strong>{user.providerId}</strong></p>
                <p>Photo</p>
                <p><img src={user.photoURL} /></p>
            </div>
        );
    }
    render() {
        return (
            <Layout>
                <h1>Hello world!</h1>
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
        actions: bindActionCreators(UserActions as any, dispatch) as typeof UserActions
    };
}

export const Home = connect(mapStateToProps, mapDispatchToProps)(Home2);
