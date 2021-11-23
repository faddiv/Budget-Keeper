import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { bind } from "bind-decorator";

import { AlertsActions } from "../../actions/alerts";
import { Layout } from "../../layout";
import { updateState, NavLink, TabPane } from "../../react-ext";
import { StockTable } from "./subComponents";
import { _, toDateString, toErrorMessage } from "../../helpers";
import { transactionService, importExportService, Wallet, ArticleModel, Transaction } from "../../walletApi";
import { RootState } from "../../reducers";
import { Pager, dataFrom, dataTo, TransactionViewModel, TransactionTable } from "../../walletCommon";
import { Component } from "react";

export interface ImportPageProps {
  wallets: Wallet[];
  actions?: typeof AlertsActions;
}

export interface ImportPageState {
  activeTab: string;
  transactions: TransactionViewModel[];
  stocks: ArticleModel[];
  file: FileList;
  page: number;
  pageStocks: number;
  pageSize: number;
}

class ImportPage2 extends Component<ImportPageProps, ImportPageState> {
  constructor(props: ImportPageProps) {
    super(props);
    this.state = {
      activeTab: "full",
      stocks: [],
      file: undefined as any,
      transactions: [],
      page: 1,
      pageStocks: 1,
      pageSize: 10,
    };
  }

  createStockGroups(transactions: TransactionViewModel[]) {
    const stocks = [];
    const grouping: {
      [name: string]: ArticleModel;
    } = {};
    for (const element of transactions) {
      if (grouping[element.name || ""]) {
        grouping[element.name || ""].category = grouping[element.name || ""].category || element.category;
        const occurence = (grouping[element.name || ""].occurence || 0) + 1;
        grouping[element.name || ""].occurence = occurence;
      } else {
        grouping[element.name || ""] = {
          name: element.name || "",
          category: element.category,
          occurence: 1,
        };
      }
    }
    for (const key in grouping) {
      if (grouping.hasOwnProperty(key)) {
        stocks.push(grouping[key]);
      }
    }
    stocks.sort((left, right) => (right.occurence || 0) - (left.occurence || 0));
    this.setState({
      stocks,
    });
  }

  @bind
  setActiveTab(newTab: any) {
    this.setState({
      activeTab: newTab,
    });
  }

  @bind
  selectPage(page: number) {
    this.setState({
      page,
    });
  }

  @bind
  selectStocksPage(pageStocks: number) {
    this.setState({
      pageStocks,
    });
  }

  @bind
  handleInputChange(event: React.ChangeEvent<HTMLFormElement>) {
    const state = updateState(event);
    this.setState(state);
  }

  @bind
  async upload(event: React.FormEvent<HTMLFormElement>) {
    try {
      const { file } = this.state;
      const { actions } = this.props;
      event.preventDefault();
      actions?.dismissAllAlert();
      if (!file || !file.length) {
        actions?.showAlert({ type: "danger", message: "Please select a file" });
        return;
      }
      const transactions = await importExportService.uploadTransactions(file[0]);
      this.setState({
        transactions: transactions.map((tr, index) => {
          return {
            category: tr.category,
            comment: tr.comment,
            createdAt: toDateString(tr.created),
            direction: tr.direction,
            key: index,
            name: tr.name,
            price: tr.amount?.toString(10),
            transactionId: tr.matchingId,
            walletId: tr.source === "Cash" ? 1 : 2,
          };
        }),
        page: 1,
        pageStocks: 1,
      });
      this.createStockGroups(transactions);
    } catch (error) {
      this.props.actions?.showAlert({ type: "danger", message: toErrorMessage(error) });
    }
  }

  @bind
  async save() {
    try {
      const { transactions } = this.state;
      const { actions } = this.props;
      actions?.dismissAllAlert();
      const serverTransactions = transactions.map((tr) => {
        return {
          category: tr.category,
          comment: tr.comment,
          createdAt: tr.createdAt ? new Date(tr.createdAt) : null,
          direction: tr.direction,
          name: tr.name,
          transactionId: tr.transactionId,
          value: tr.price ? parseInt(tr.price, 10) : 0,
          walletId: tr.walletId,
        } as Transaction;
      });
      await transactionService.batchUpdate(serverTransactions);
      this.setState({
        transactions: [],
        stocks: [],
        activeTab: "full",
      });
    } catch (error) {
      this.props.actions?.showAlert({ type: "danger", message: toErrorMessage(error) });
    }
  }

  @bind
  transactionUpdated(items: TransactionViewModel[]): void {
    this.setState({
      transactions: items,
    });
  }

  @bind
  transactionDeleted(item: TransactionViewModel) {
    this.setState((prevState) => {
      return {
        transactions: _.remove(prevState.transactions, item),
      };
    });
  }

  @bind
  rowColoring(item: TransactionViewModel): string {
    if (item.transactionId) {
      return "table-info";
    }
    return "";
  }

  render() {
    const { activeTab, stocks, transactions, page, pageSize, pageStocks } = this.state;
    const { wallets } = this.props;
    const countAll = transactions ? transactions.length : 0;
    const countStocks = stocks ? stocks.length : 0;
    return (
      <Layout>
        <div className="row">
          <form onChange={this.handleInputChange} onSubmit={this.upload}>
            <div className="form-group">
              <label htmlFor="file">File</label>
              <input type="file" id="file" name="file" className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary">
              Upload
            </button>
            <button type="button" className="btn btn-success" onClick={this.save}>
              Save
            </button>
          </form>
        </div>
        <div className="row">
          <div className="col-sm">
            <span>Number of imported row:</span>
            <span>{0}</span>
          </div>
        </div>
        <ul className="nav nav-tabs">
          <NavLink name="full" activeKey={activeTab} onActivate={this.setActiveTab}>
            Full list
          </NavLink>
          <NavLink name="groupStock" activeKey={activeTab} onActivate={this.setActiveTab}>
            Group stock
          </NavLink>
        </ul>
        <div className="tab-content">
          <TabPane name="full" activeKey={activeTab}>
            <TransactionTable
              items={transactions.slice(dataFrom(page, pageSize, countAll), dataTo(page, pageSize, countAll))}
              wallets={wallets}
              update={this.transactionUpdated}
              deleted={this.transactionDeleted}
              rowColor={this.rowColoring}
            />
            <Pager page={page} pageSize={pageSize} countAll={countAll} onPageSelected={this.selectPage} />
          </TabPane>
          <TabPane name="groupStock" activeKey={activeTab}>
            <StockTable articles={stocks.slice(dataFrom(pageStocks, pageSize, countStocks), dataTo(pageStocks, pageSize, countStocks))} />
            <Pager page={pageStocks} pageSize={pageSize} countAll={countStocks} onPageSelected={this.selectStocksPage} />
          </TabPane>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    wallets: state.wallets,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions,
  };
}

export const ImportPage = connect(mapStateToProps, mapDispatchToProps)(ImportPage2);
