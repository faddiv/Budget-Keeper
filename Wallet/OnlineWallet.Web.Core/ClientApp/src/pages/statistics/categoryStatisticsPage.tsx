import * as React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { bindActionCreators } from "redux";
import { bind } from "bind-decorator";

import { Layout } from "../../layout";
import { AlertsActions } from "../../actions/alerts";
import { CategoryStatisticsSummary, statisticsService, CategoryStatistics, Wallet } from "../../walletApi";
import { CategoryTable } from "./subComponents/categoryTable";
import { YearSelector } from "./subComponents/yearSelector";
import { RootState } from "../../reducers";
import { toErrorMessage, toServerDate } from "../../helpers";
import { Tab, Tabs } from "react-bootstrap";

export interface CategoryStatisticsPageParams {
  year?: string;
}

export interface CategoryStatisticsPageProps extends Partial<RouteComponentProps<CategoryStatisticsPageParams>> {
  wallets: Wallet[];
  actions: typeof AlertsActions;
}

export interface CategoryStatisticsPageState {
  stats: CategoryStatisticsSummary;
  year: number;
}

class CategoryStatisticsPage2 extends React.Component<CategoryStatisticsPageProps, CategoryStatisticsPageState> {
  constructor(props: CategoryStatisticsPageProps) {
    super(props);
    const year = parseInt(this.props.match?.params.year || "0", 10) || new Date().getFullYear();
    this.state = {
      stats: defaultData(),
      year,
    };
  }

  @bind
  async componentDidMount() {
    try {
      const stats = await statisticsService.categories(this.state.year);
      this.setState({
        stats,
      });
    } catch (error) {
      this.setState({
        stats: defaultData(),
      });
      this.props.actions.showAlert({ type: "danger", message: toErrorMessage(error) });
    }
  }

  componentWillReceiveProps(nextProps: CategoryStatisticsPageProps) {
    const year = parseInt(nextProps.match?.params.year || "0", 10) || new Date().getFullYear();
    this.setState(
      {
        year,
      },
      this.componentDidMount
    );
  }

  @bind
  renderMonthTable(monthData: CategoryStatistics[], monthIndex: number) {
    const { year } = this.state;
    const { wallets } = this.props;
    const date = moment([year, monthIndex, 1]);
    const monthKey = date.format("MM");
    const endDate = moment(date).endOf("month");
    const monthName = date.format("MMM");
    return (
      <Tab key={monthKey} eventKey={monthKey} title={monthName}>
        <CategoryTable categories={monthData} wallets={wallets} startDate={toServerDate(date)} endDate={toServerDate(endDate)} />
      </Tab>
    );
  }

  render() {
    const { wallets } = this.props;
    const { stats, year } = this.state;
    const { yearly, monthly } = stats;
    const date = moment([year, 0, 1]);
    const endDate = moment(date).endOf("year");
    return (
      <Layout>
        <YearSelector year={year} link="/statistics/category" />
        <Tabs defaultActiveKey="yearly" id="statistics-tabs">
          <Tab key="yearly" eventKey="yearly" title="Full list">
            <CategoryTable categories={yearly} wallets={wallets} startDate={toServerDate(date)} endDate={toServerDate(endDate)} />
          </Tab>
          {monthly.map(this.renderMonthTable)}
        </Tabs>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions,
  };
}

function mapStateToProps(state: RootState) {
  return {
    wallets: state.wallets,
  };
}

function defaultData(): CategoryStatisticsSummary {
  return {
    yearly: [],
    monthly: [],
  };
}

export const CategoryStatisticsPage = connect(mapStateToProps, mapDispatchToProps)(CategoryStatisticsPage2);
