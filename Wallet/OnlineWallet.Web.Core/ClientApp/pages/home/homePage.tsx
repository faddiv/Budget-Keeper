import * as React from "react";
import * as moment from "moment";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { AlertsActions } from "actions/alerts";
import { Wallet, transactionService } from "walletApi";
import { Layout } from "layout";
import { AddItemForm, SaveAllResult } from "./subComponents";
import { RootState } from "reducers";
import { _, bind } from "helpers";
import { TransactionTable, getDirectionColoring, TransactionViewModel, mapTransaction } from "walletCommon";

export namespace Home {
    export interface Props {
        wallets: Wallet[];
        actions?: typeof AlertsActions;
    }

    export interface State {
        items: TransactionViewModel[];
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class Home extends React.Component<Home.Props, Home.State> {

    /**
     *
     */
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.confirmLeave);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.confirmLeave);
    }

    get alertsService() {
        return this.props.actions;
    }

    @bind
    confirmLeave(event: BeforeUnloadEvent) {
        if (this.needLeaveConfirmation()) {
            event.returnValue = leaveConfirmation;
            return leaveConfirmation;
        }
    }

    @bind
    deleteRow(item: TransactionViewModel) {
        this.setState((prevState, props) => {
            return {
                items: _.remove(prevState.items, item)
            };
        });
    }

    @bind
    updateRow(items: TransactionViewModel[]) {
        this.setState((prevState, props) => {
            return {
                items
            };
        });
    }

    @bind
    addLine(newItem: TransactionViewModel) {
        this.setState((prevState, props) => {
            return {
                items: [...prevState.items, newItem]
            };
        });
    }

    @bind
    async saveAll(): Promise<SaveAllResult> {
        try {
            this.alertsService.dismissAllAlert();
            if (!this.state.items.length) {
                this.alertsService.showAlert({ type: "warning", message: "Nothing to save" });
                return;
            }
            const serverItems = mapTransaction(this.state.items);
            const result = await transactionService.batchUpdate(serverItems);
            this.alertsService.showAlert({ type: "success", message: "Transactions are saved successfully." });
            this.setState({
                items: []
            });
            return "success";
        } catch (e) {
            this.alertsService.showAlert({ type: "danger", message: e.message });
            return "fail";
        }
    }

    needLeaveConfirmation() {
        return this.state.items.length > 0;
    }

    render() {
        const { wallets } = this.props;
        const { items } = this.state;
        return (
            <Layout leaveConfirmation={{ when: this.needLeaveConfirmation(), message: leaveConfirmation }}>
                <AddItemForm addLine={this.addLine} saveAll={this.saveAll} wallets={wallets} />
                <TransactionTable
                    items={items} wallets={wallets}
                    deleted={this.deleteRow} update={this.updateRow} rowColor={getDirectionColoring} />
            </Layout>
        );
    }
}

function mapStateToProps(state: RootState, ownProps: any) {
    return {
        wallets: state.wallets
    };
}

function mapDispatchToProps(dispatch, ownProps: any) {
    return {
        actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions
    };
}

const leaveConfirmation = "There are added items. Are you sure leaving?";
