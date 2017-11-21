import * as React from 'react';
import { Layout } from 'layout';
import { NavLink, TabPane } from 'common/tabpanel';
import { bind } from 'walletCommon';

export namespace ImportPage {
    export interface Props {
    }
    export interface State {
        activeTab: string;
    }
}

export class ImportPage extends React.Component<ImportPage.Props, ImportPage.State> {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "full"
        };
    }

    @bind
    setActiveTab(newTab) {
        this.setState({
            activeTab: newTab
        });
    }
    render() {
        const { activeTab } = this.state;
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
                    <TabPane name="groupStock" activeKey={activeTab}>app-stock-table</TabPane>
                </div>
            </Layout>
        );
    }
}