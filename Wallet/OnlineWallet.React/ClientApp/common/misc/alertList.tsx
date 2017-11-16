import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AlertsActions from "actions/alerts"
import { AlertMessage } from 'reducers/alerts/alertsModel';
import { RootState } from 'reducers';
import { bind } from 'walletCommon';

export namespace AlertList {
    export interface Props {
        alerts?: AlertMessage[],
        actions?: typeof AlertsActions,
    }
    export interface State {
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class AlertList extends React.Component<AlertList.Props, AlertList.State> {

    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    dismissAlert(alert: AlertMessage) {
        this.props.actions.dismissAlert(alert);
    }

    @bind
    renderAlert(alert: AlertMessage, index: number) {
        const css = "alert alert-" + alert.type;
        return (
            <div key={index} className={css} role="alert">
                {alert.message}
                <button type="button" className="close" aria-label="Close" onClick={() => this.dismissAlert(alert)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.alerts.map(this.renderAlert)}
            </div>
        );
    }
}

function mapStateToProps(state: RootState, ownProps: any) {
    return {
        alerts: state.alerts
    };
}

function mapDispatchToProps(dispatch, ownProps: any) {
    return {
        actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions
    };
}