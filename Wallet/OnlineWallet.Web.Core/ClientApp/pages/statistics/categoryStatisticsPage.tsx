import * as React from "react";
import * as moment from "moment";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators } from "redux";
import { NavLink, TabPane } from "react-ext";
import { bind } from "bind-decorator";

import { Layout } from "layout";
import { AlertsActions } from "actions/alerts";
import { CategoryStatisticsSummary, statisticsService, CategoryStatistics } from "walletApi";
import { CategoryTable } from "./subComponents/categoryTable";
import { YearSelector } from "./subComponents/yearSelector";

export interface CategoryStatisticsPageParams {
    year?: string;
}

export interface CategoryStatisticsPageProps extends Partial<RouteComponentProps<CategoryStatisticsPageParams>> {
    actions: typeof AlertsActions;
}

export interface CategoryStatisticsPageState {
    activeTab: string;
    stats: CategoryStatisticsSummary;
    year: number;
}

@connect(null, mapDispatchToProps)
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
            this.props.actions.showAlert({ type: "danger", message: "Failed to load yearly statistics." });
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
        const { activeTab } = this.state;
        const monthName = moment(monthIndex + 1, "MM").format("MMM");
        return (
            <TabPane key={monthIndex} name={`${monthName}`} activeKey={activeTab}>
                <CategoryTable categories={monthData} />
            </TabPane>
        );
    }

    render() {
        const { } = this.props;
        const { activeTab, stats, year } = this.state;
        const { yearly, monthly } = stats;
        return (
            <Layout>
                <YearSelector year={year} link="/statistics/category" />
                <ul className="nav nav-tabs">
                    <NavLink key="yearly" name="yearly" activeKey={activeTab} onActivate={this.setActiveTab}>Full list</NavLink>
                    {monthly.map(this.renderMonthLink)}
                </ul>
                <div className="tab-content">
                    <TabPane name="yearly" activeKey={activeTab}>
                        <CategoryTable categories={yearly} />
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

function defaultData(): CategoryStatisticsSummary {
    return {
        yearly: [],
        monthly: []
    };
}
