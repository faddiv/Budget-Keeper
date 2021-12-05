import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { bind } from "bind-decorator";

import { AlertsActions } from "../../services/actions/alerts";
import { StockTable } from "./components";
import { _, toDateString, toErrorMessage, updateState, TransactionViewModel } from "../../services/helpers";
import { transactionService, importExportService, ArticleModel, Transaction } from "../../services/walletApi";
import { Pager, dataFrom, dataTo } from "../../components/MiniComponents/pager";
import { TransactionTable } from "../../components/TransactionTable";
import { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";

export interface ImportPageProps {
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
  transactionUpdated(newItem: TransactionViewModel, original: TransactionViewModel): void {
    const transactions = _.replace(this.state.transactions, newItem, original);
    this.setState({
      transactions,
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
    const countAll = transactions ? transactions.length : 0;
    const countStocks = stocks ? stocks.length : 0;
    return (
      <>
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
        <Tabs id="import" activeKey={activeTab} onSelect={this.setActiveTab}>
          <Tab eventKey="full" title="Full list">
            <TransactionTable
              items={transactions.slice(dataFrom(page, pageSize, countAll), dataTo(page, pageSize, countAll))}
              update={this.transactionUpdated}
              deleted={this.transactionDeleted}
              rowColor={this.rowColoring}
            />
            <Pager page={page} pageSize={pageSize} countAll={countAll} onPageSelected={this.selectPage} />
          </Tab>
          <Tab eventKey="groupStock" title="Group stock">
            <StockTable articles={stocks.slice(dataFrom(pageStocks, pageSize, countStocks), dataTo(pageStocks, pageSize, countStocks))} />
            <Pager page={pageStocks} pageSize={pageSize} countAll={countStocks} onPageSelected={this.selectStocksPage} />
          </Tab>
        </Tabs>
      </>
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions,
  };
}

export const ImportPage = connect(undefined, mapDispatchToProps)(ImportPage2);
