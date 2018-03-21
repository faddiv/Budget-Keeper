import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { bind } from "bind-decorator";

import { RootState } from "reducers";
import { TransactionViewModel } from "walletCommon";
import { TransactionSummaryActions, TransactionSummaryViewModel } from "actions/transactionsSummary";
import { MoneyDirection } from "walletApi";

export interface TransactionSummaryProps extends Partial<RouteComponentProps<void>> {
    transactionSummary?: TransactionViewModel[];
    actions?: typeof TransactionSummaryActions;
}

export interface TransactionSummaryState {
}

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export class TransactionSummary extends React.Component<TransactionSummaryProps, TransactionSummaryState> {

    private navListener: () => void;

    constructor(props) {
        super(props);
    }

    @bind
    private locationListener() {
        const { actions, transactionSummary } = this.props;
        if (transactionSummary.length > 0) {
            actions.transactionsSelected([]);
        }
    }

    componentDidMount() {
        this.navListener = this.props.history.listen(this.locationListener);
    }

    componentWillUnmount() {
        this.navListener();
        this.navListener = null;
    }

    @bind
    close() {
        this.props.actions.transactionsSelected([]);
    }

    render() {
        const { transactionSummary } = this.props;
        if (!transactionSummary || !transactionSummary.length) {
            return null;
        }
        const expenses = sumPrice(transactionSummary, MoneyDirection.Expense);
        const incomes = sumPrice(transactionSummary, MoneyDirection.Income);
        const plans = sumPrice(transactionSummary, MoneyDirection.Plan);
        return (
            <div className="transaction-summary card bg-light">
                <div className="crad-body">
                    <span>Expenses: {expenses}</span>&nbsp;
                    <span>Incomes: {incomes}</span>&nbsp;
                    <span>Plans: {plans}</span>
                    <button type="button" className="close" aria-label="Close" onClick={this.close}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        );
    }
}

function sumPrice(items: TransactionSummaryViewModel, dir: MoneyDirection): number {
    let sum: number = 0;
    for (const element of items) {
        if (element.direction === dir) {
            sum += parseInt(element.price, 10);
        }
    }
    return sum;
}

function mapStateToProps(state: RootState) {
    return {
        transactionSummary: state.transactionSummary
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionSummaryActions as any, dispatch) as typeof TransactionSummaryActions
    };
}
