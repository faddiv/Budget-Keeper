import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

/*export namespace Home {
    export interface Props extends RouteComponentProps<void> {

    }

    export interface State {

    }
}*/

export class Home extends React.Component {//<Home.Props, Home.State>
    render() {
        return (
            <div>Hello</div>
        );
    }
}