import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { bind } from "bind-decorator";

import { ArticleModel, articleService, Wallet, transactionService } from "../../services/walletApi";
import { preventDefault, updateState, getWalletNameById, TransactionViewModel, mapTransactionViewModel, toErrorMessage } from "../../services/helpers";
import { RootState } from "../../services/reducers";
import { AlertsActions } from "../../services/actions/alerts";
import { DetailsTable } from "./components/DetailsTable";

export interface ArticlesPageProps {
  wallets: Wallet[];
  actions: typeof AlertsActions;
}

export interface ArticlesPageState {
  articles: ArticleModel[];
  name: string;
  openItem: ArticleModel | null;
  sync: boolean;
}

class ArticlesPage2 extends React.Component<ArticlesPageProps, ArticlesPageState> {
  constructor(props: ArticlesPageProps) {
    super(props);
    this.state = {
      articles: [],
      name: "",
      openItem: null,
      sync: false,
    };
  }

  @bind
  async handleInputChange(event: React.SyntheticEvent<HTMLInputElement>) {
    try {
      const state = updateState(event);
      if (state.name && state.name.length > 1) {
        this.setState(state);
        const articles = await articleService.filterBy(state.name, 30);
        this.setState({
          articles,
        });
      } else {
        state.articles = [];
        this.setState(state);
      }
    } catch (error) {
      this.props.actions.showAlert({ type: "danger", message: toErrorMessage(error) });
    }
  }

  @bind
  async synchronize() {
    this.setState({
      sync: true,
    });
    try {
      await articleService.syncFromTransactions();
      const articles = await articleService.filterBy(this.state.name, 30);
      this.setState({
        articles,
        sync: false,
      });
      this.props.actions.showAlert({
        type: "success",
        message: "Synchronization successful",
      });
    } catch (error) {
      this.setState({
        sync: false,
      });
      this.props.actions.showAlert({
        type: "danger",
        message: "Synchronization failed: " + toErrorMessage(error),
      });
    }
  }

  @bind
  async openRow(item: ArticleModel) {
    this.setState((prevState) => {
      return {
        openItem: prevState.openItem === item ? null : item,
      };
    });
  }

  @bind
  async queryDetails(parentRow: ArticleModel, take: number, skip: number): Promise<TransactionViewModel[]> {
    const transactions = await transactionService.fetchArticle(parentRow.name || "", take, skip).then(mapTransactionViewModel);
    return transactions;
  }

  @bind
  toggleDetails(parentRow: any, open: boolean) {
    this.setState({
      openItem: open ? parentRow : undefined,
    });
  }

  renderSubTable(item: ArticleModel) {
    const { openItem } = this.state;
    if (item === openItem) {
      return <DetailsTable key={item.name + "collapse"} colSpan={5} parentRow={item} queryDetails={this.queryDetails} />;
    } else {
      return null;
    }
  }

  renderTableRow(item: ArticleModel) {
    const { wallets } = this.props;
    return (
      <tr key={item.name} onClick={() => this.openRow(item)}>
        <td>{item.name}</td>
        <td>{item.category}</td>
        <td>{item.lastPrice}</td>
        <td>{getWalletNameById(item.lastWallet, wallets)}</td>
        <td>{item.occurence}</td>
      </tr>
    );
  }

  render() {
    const { name, articles, sync } = this.state;
    return (
      <>
        <form onSubmit={preventDefault}>
          <div className="form-group row">
            <label htmlFor="name" className="col-sm-2 col-form-label">
              Article
            </label>
            <div className="col-sm-8">
              <input
                type="name"
                className="form-control"
                id="name"
                name="name"
                placeholder="Search article..."
                value={name}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="col-sm-2">
              <button className="btn btn-danger" type="button" onClick={this.synchronize} disabled={sync}>
                Synchronize {sync ? <i className="fa fa-spinner fa-spin"></i> : null}
              </button>
            </div>
          </div>
        </form>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Last price</th>
              <th>Last wallet</th>
              <th>Occurence</th>
            </tr>
          </thead>
          <tbody>{articles.map((item) => [this.renderTableRow(item), this.renderSubTable(item)])}</tbody>
        </table>
      </>
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

export const ArticlesPage = connect(mapStateToProps, mapDispatchToProps)(ArticlesPage2);
