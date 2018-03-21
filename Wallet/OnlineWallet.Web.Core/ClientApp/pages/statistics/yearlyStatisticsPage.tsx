import * as React from "react";
import * as moment from "moment";
import { RouteComponentProps } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { bind } from "bind-decorator";

import { YearlyStatistics, statisticsService } from "walletApi";
import { formatInt } from "helpers";
import { Layout } from "layout";
import { AlertsActions } from "actions/alerts";
import { YearSelector } from "./subComponents/yearSelector";

export interface YearlyStatisticsPageParams {
    year?: string;
}

export interface YearlyStatisticsPageProps extends Partial<RouteComponentProps<YearlyStatisticsPageParams>> {
    actions: typeof AlertsActions;
}

export interface YearlyStatisticsPageState {
    yearly: YearlyStatistics;
    year: number;
}

@connect(null, mapDispatchToProps)
export class YearlyStatisticsPage extends React.Component<YearlyStatisticsPageProps, YearlyStatisticsPageState> {
    constructor(props) {
        super(props);
        const year = parseInt(this.props.match.params.year, 10) || new Date().getFullYear();
        this.state = {
            year,
            yearly: defaultYearly()
        };
    }

    @bind
    async componentDidMount() {
        try {
            const yearly = await statisticsService.yearly(this.state.year);
            this.setState({
                yearly
            });
        } catch (error) {
            this.setState({
                yearly: defaultYearly()
            });
            this.props.actions.showAlert({ type: "danger", message: "Failed to load yearly statistics." });
        }
    }

    componentWillReceiveProps(nextProps: YearlyStatisticsPageProps) {
        const year = parseInt(nextProps.match.params.year, 10) || new Date().getFullYear();
        this.setState({
            year
        }, this.componentDidMount);
    }

    render() {
        const { yearly, year } = this.state;
        const monthly = yearly.monthly || [];
        return (
            <Layout>
                <YearSelector year={year} link="/statistics/yearly" />
                <table className="table table-condensed yearly-statistics">
                    <thead>
                        <tr>
                            <th scope="col">Month</th>
                            <th scope="col">Income</th>
                            <th scope="col">Spent</th>
                            <th scope="col">Savings</th>
                            <th scope="col">Unused</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthly.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{moment(index + 1, "MM").format("MMM")}</th>
                                <td>{formatInt(item.income)}</td>
                                <td>{formatInt(item.spent)}</td>
                                <td>{formatInt(item.toSaving)}</td>
                                <td>{formatInt(item.unused)}</td>
                            </tr>
                        ))}
                        {yearly && (
                            <tr className="table-info">
                                <th scope="row">Summary</th>
                                <td>{formatInt(yearly.income)}</td>
                                <td>{formatInt(yearly.spent)}</td>
                                <td>{formatInt(yearly.toSaving)}</td>
                                <td>{formatInt(yearly.unused)}</td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </Layout>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions
    };
}

function defaultYearly(): YearlyStatistics {
    return {
        income: 0,
        monthly: [],
        planned: 0,
        spent: 0,
        toSaving: 0,
        unused: 0
    };
}
