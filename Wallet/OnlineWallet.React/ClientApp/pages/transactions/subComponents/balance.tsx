import * as React from 'react';
import { BalanceInfo } from 'walletApi';

export namespace Balance {
    export interface Props {
        balance: BalanceInfo;
    }
    export interface State {
    }
}

export class Balance extends React.Component<Balance.Props, Balance.State> {
    constructor(props) {
        super(props);
    }
    render() {
        var { balance } = this.props;
        if (!balance)
            return null;
        return (
            <article className="row">
                <div className="col-sm"><span>Income:</span><strong>{balance.income}</strong></div>
                <div className="col-sm"><span>Spent:</span><strong>{balance.spent}</strong></div>
                <div className="col-sm"><span>Saving:</span><strong>{balance.toSaving}</strong></div>
                <div className="col-sm"><span>Planned:</span><strong>{balance.planned}</strong></div>
                <div className="w-100"></div>
                <div className="col-sm"><span>Unused:</span><strong>{balance.unused}</strong></div>
            </article>
        );
    }
}