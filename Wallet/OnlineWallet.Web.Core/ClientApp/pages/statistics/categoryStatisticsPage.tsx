import * as React from "react";
import * as moment from "moment";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators } from "redux";
import { NavLink, TabPane } from "react-ext";
import { bind } from "bind-decorator";

import { Layout } from "layout";
import { AlertsActions } from "actions/alerts";
import { CategoryStatisticsSummary, statisticsService, CategoryStatistics, Wallet } from "walletApi";
import { CategoryTable } from "./subComponents/categoryTable";
import { YearSelector } from "./subComponents/yearSelector";
import { RootState } from "reducers";
import { toServerDate } from "helpers";

export interface CategoryStatisticsPageParams {
    year?: string;
}

export interface CategoryStatisticsPageProps extends Partial<RouteComponentProps<CategoryStatisticsPageParams>> {
    wallets: Wallet[];
    actions: typeof AlertsActions;
}

export interface CategoryStatisticsPageState {
    activeTab: string;
    stats: CategoryStatisticsSummary;
    year: number;
}

@connect(mapStateToProps, mapDispatchToProps)
export class CategoryStatisticsPage extends React.Component<CategoryStatisticsPageProps, CategoryStatisticsPageState> {
    constructor(props) {
        super(props);
        const year = parseInt(this.props.match.params.year, 10) || new Date().getFullYear();
        this.state = {
            activeTab: "yearly",
            stats: defaultData(),
            year
        };
    }

    @bind
    async componentDidMount() {
        try {
            const stats = await statisticsService.categories(this.state.year);
            this.setState({
                stats
            });
        } catch (error) {
            this.setState({
                stats: defaultData()
            });
            this.props.actions.showAlert({ type: "danger", message: error.message });
        }
    }

    componentWillReceiveProps(nextProps: CategoryStatisticsPageProps) {
        const year = parseInt(nextProps.match.params.year, 10) || new Date().getFullYear();
        this.setState({
            year
        }, this.componentDidMount);
    }

    @bind
    setActiveTab(newTab) {
        this.setState({
            activeTab: newTab
        });
    }

    @bind
    renderMonthLink(_monthData: CategoryStatistics[], monthIndex: number) {
        const { activeTab } = this.state;
        const monthName = moment(monthIndex + 1, "MM").format("MMM");
        return (
            <NavLink key={monthIndex} name={`${monthName}`} activeKey={activeTab} onActivate={this.setActiveTab}>
                {monthName}
            </NavLink>
        );
    }

    @bind
    renderMonthTable(monthData: CategoryStatistics[], monthIndex: number) {
        const { activeTab, year } = this.state;
        const { wallets } = this.props;
        const date = moment([year, monthIndex, 1]);
        const monthName = date.format("MMM");
        const endDate = moment(date).endOf("month");
        return (
            <TabPane key={monthIndex} name={`${monthName}`} activeKey={activeTab}>
                <CategoryTable categories={monthData} wallets={wallets} startDate={toServerDate(date)} endDate={toServerDate(endDate)} />
            </TabPane>
        );
    }

    render() {
        const { wallets } = this.props;
        const { activeTab, stats, year } = this.state;
        const { yearly, monthly } = stats;
        const date = moment([year, 0, 1]);
        const endDate = moment(date).endOf("year");
        return (
            <Layout>
                <YearSelector year={year} link="/statistics/category" />
                <ul className="nav nav-tabs">
                    <NavLink key="yearly" name="yearly" activeKey={activeTab} onActivate={this.setActiveTab}>Full list</NavLink>
                    {monthly.map(this.renderMonthLink)}
                </ul>
                <div className="tab-content">
                    <TabPane name="yearly" activeKey={activeTab}>
                        <CategoryTable categories={yearly} wallets={wallets} startDate={toServerDate(date)} endDate={toServerDate(endDate)} />
                    </TabPane>
                    {monthly.map(this.renderMonthTable)}
                </div>
            </Layout>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions
    };
}

function mapStateToProps(state: RootState) {
    return {
        wallets: state.wallets
    };
}

function defaultData(): CategoryStatisticsSummary {
    return {
        yearly: [],
        monthly: []
    };
}
