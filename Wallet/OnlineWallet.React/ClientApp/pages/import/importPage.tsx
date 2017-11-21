import * as React from 'react';
import { Layout } from 'layout';
import { NavLink, TabPane } from 'common/tabpanel';
import { StockTable, StockModel } from './subComponents';
import { bind } from 'walletCommon';
import { transactionService } from 'walletApi';

export namespace ImportPage {
    export interface Props {
    }
    export interface State {
        activeTab: string;
        stocks: StockModel[];
    }
}

export class ImportPage extends React.Component<ImportPage.Props, ImportPage.State> {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "full",
            stocks: []
        };
    }

    async componentDidMount() {
        var newItems = await transactionService.fetch();
        var stocks = [];
        const grouping: {
            [name: string]: StockModel
        } = {};
        for (let index = 0; index < newItems.length; index++) {
            const element = newItems[index];
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
    render() {
        const { activeTab, stocks } = this.state;
        return (
            <Layout>
                <div className="row">
                    <div>app-import-transactions</div>
                </div>
                <div className="row">
                    <div className="col-md-2">
                        <span>Number of imported row:</span>
                        <span>{"asd"}</span>
                    </div>
                </div>
                <ul className="nav nav-tabs">
                    <NavLink name="full" activeKey={activeTab} onActivate={this.setActiveTab}>Full list</NavLink>
                    <NavLink name="groupStock" activeKey={activeTab} onActivate={this.setActiveTab}>Group stock</NavLink>
                </ul>
                <div className="tab-content">
                    <TabPane name="full" activeKey={activeTab}>app-paged-transaction-table</TabPane>
                    <TabPane name="groupStock" activeKey={activeTab}><StockTable stocks={stocks} /></TabPane>
                </div>
            </Layout>
        );
    }
}