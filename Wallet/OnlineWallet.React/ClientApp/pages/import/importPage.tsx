import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AlertsActions from "actions/alerts"
import { Layout } from 'layout';
import { NavLink, TabPane } from 'common/tabpanel';
import { StockTable, StockModel } from './subComponents';
import { bind, updateState, ListHelpers } from 'walletCommon';
import { transactionService, importExportService, ExportImportRow, Wallet } from 'walletApi';
import { TransactionTable } from 'common/transactions-view';
import { TransactionViewModel, toDateString } from 'common/models';
import { RootState } from 'reducers';

export namespace ImportPage {
    export interface Props {
        wallets: Wallet[];
        actions?: typeof AlertsActions,
    }
    export interface State {
        activeTab: string;
        transactions: TransactionViewModel[];
        stocks: StockModel[];
        file: FileList;
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class ImportPage extends React.Component<ImportPage.Props, ImportPage.State> {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "full",
            stocks: [],
            file: undefined,
            transactions: []
        };
    }

    async componentDidMount() {
        var transactions = await transactionService.fetch();
        this.createStockGroups(transactions);
    }

    createStockGroups(transactions) {
        var stocks = [];
        const grouping: {
            [name: string]: StockModel
        } = {};
        for (let index = 0; index < transactions.length; index++) {
            const element = transactions[index];
            if (grouping[element.name]) {
                grouping[element.name].category = grouping[element.name].category || element.category;
                grouping[element.name].count++;
            } else {
                grouping[element.name] = new StockModel(element.name, element.category, 1);
            }
        }
        for (const key in grouping) {
            if (grouping.hasOwnProperty(key)) {
                stocks.push(grouping[key]);
            }
        }
        stocks.sort((left, right) => right.count - left.count);
        this.setState({
            stocks: stocks
        });
    }

    @bind
    setActiveTab(newTab) {
        this.setState({
            activeTab: newTab
        });
    }

    @bind
    handleInputChange(event: React.ChangeEvent<HTMLFormElement>) {
        var state = updateState(event);
        this.setState(state);
    }

    @bind
    async upload(event: React.FormEvent<HTMLFormElement>) {
        const { file } = this.state;
        const { actions } = this.props;
        event.preventDefault();
        actions.dismissAllAlert();
        if(!file || !file.length) 
        {
            actions.showAlert({type:"danger", message:"Please select a file"});
        }
        var transactions = await importExportService.uploadTransactions(file[0]);
        this.setState({
            transactions : transactions.map((tr, index) => {
                return {
                    category: tr.category,
                    comment: tr.comment,
                    createdAt: toDateString(tr.created),
                    direction: tr.direction,
                    key: index,
                    name: tr.name,
                    price: tr.amount.toString(10),
                    transactionId: tr.matchingId,
                    walletId: tr.source === "Cash" ? 1 : 2,
                    walletName : tr.source
                } as TransactionViewModel;
            })
        });
        this.createStockGroups(transactions);
    }
    
    @bind
    transactionUpdated(items: TransactionViewModel[], changedItems: TransactionViewModel[]): void {
        this.setState({
            transactions: items
        });
    }
    
    @bind
    transactionDeleted(item: TransactionViewModel) {
        this.setState((prevState, props) => {
            return {
                transactions: ListHelpers.remove(prevState.transactions, item)
            };
        });
    }

    @bind
    rowColoring(item: TransactionViewModel): string {
        if(item.transactionId) {
            return "table-info";
        }
    }
    render() {
        const { activeTab, stocks, transactions } = this.state;
        const { wallets } = this.props;
        return (
            <Layout>
                <div className="row">
                    <form onChange={this.handleInputChange} onSubmit={this.upload}>
                        <div className="form-group">
                            <label htmlFor="file">File</label>
                            <input type="file" id="file" name="file" className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary">Upload</button>
                        <button type="button" className="btn btn-success">Save</button>
                    </form>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <span>Number of imported row:</span>
                        <span>{0}</span>
                    </div>
                </div>
                <ul className="nav nav-tabs">
                    <NavLink name="full" activeKey={activeTab} onActivate={this.setActiveTab}>Full list</NavLink>
                    <NavLink name="groupStock" activeKey={activeTab} onActivate={this.setActiveTab}>Group stock</NavLink>
                </ul>
                <div className="tab-content">
                    <TabPane name="full" activeKey={activeTab}>
                        <TransactionTable items={transactions} wallets={wallets} 
                            update={this.transactionUpdated} deleted={this.transactionDeleted} 
                            rowColor={this.rowColoring}/>
                    </TabPane>
                    <TabPane name="groupStock" activeKey={activeTab}><StockTable stocks={stocks} /></TabPane>
                </div>
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
