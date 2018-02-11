import * as React from "react";
import { bindActionCreators } from "redux";
import { RouteComponentProps, withRouter } from "react-router";
import { connect } from "react-redux";

import { AlertsActions } from "actions/alerts";
import { AlertMessage } from "reducers/alerts/alertsModel";
import { RootState } from "reducers";
import { bind } from "helpers";

export interface AlertListProps extends Partial<RouteComponentProps<void>> {
    alerts?: AlertMessage[];
    actions?: typeof AlertsActions;
}

export interface AlertListState {
}

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export class AlertList extends React.Component<AlertListProps, AlertListState> {

    private navListener: () => void;

    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    @bind
    private locationListener() {
        const { alerts, actions } = this.props;
        if (alerts.length > 0) {
            actions.dismissAllAlert();
        }
    }

    componentDidMount() {
        this.navListener = this.props.history.listen(this.locationListener);
    }

    componentWillUnmount() {
        this.navListener();
        this.navListener = null;
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

function mapStateToProps(state: RootState) {
    return {
        alerts: state.alerts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions
    };
}
