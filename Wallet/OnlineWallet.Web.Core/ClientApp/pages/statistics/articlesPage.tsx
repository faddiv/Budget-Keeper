import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { bind } from "bind-decorator";

import { Layout } from "layout";
import { ArticleModel, articleService, Wallet, transactionService } from "walletApi";
import { updateState, Collapse, noAction } from "react-ext";
import { getWalletNameById, TransactionViewModel, mapTransactionViewModel, getDirectionColoring, TransactionTable } from "walletCommon";
import { RootState } from "reducers";
import { AlertsActions } from "actions/alerts";

interface OpenedArticles {
    [name: string]: TransactionViewModel[][];
}

export interface ArticlesPageProps {
    wallets: Wallet[];
    actions: typeof AlertsActions;
}

export interface ArticlesPageState {
    articles: ArticleModel[];
    name: string;
    openItem: ArticleModel;
    openedArticleTransactions: TransactionViewModel[];
    pageNumber: number;
    sync: boolean;
}

@connect(mapStateToProps, mapDispatchToProps)
export class ArticlesPage extends React.Component<ArticlesPageProps, ArticlesPageState> {

    transactionsCache: OpenedArticles;

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            name: "",
            openItem: null,
            openedArticleTransactions: [],
            pageNumber: 0,
            sync: false
        };
        this.transactionsCache = {};
    }

    @bind
    async handleInputChange(event: React.SyntheticEvent<HTMLInputElement>) {
        const state = updateState(event);
        if (state.name && state.name.length > 1) {
            this.setState(state);
            const articles = await articleService.filterBy(state.name, 30);
            this.setState({
                articles
            });
        } else {
            state.articles = [];
            this.setState(state);
        }
    }

    @bind
    async synchronize() {
        this.setState({
            sync: true
        });
        try {
            await articleService.syncFromTransactions();
            const articles = await articleService.filterBy(this.state.name, 30);
            this.setState({
                articles,
                sync: false
            });
            this.props.actions.showAlert({
                type: "success",
                message: "Synchronization successful"
            });
        } catch {
            this.setState({
                sync: false
            });
            this.props.actions.showAlert({
                type: "danger",
                message: "Synchronization failed"
            });
        }
    }

    @bind
    async openRow(item: ArticleModel) {
        const state = this.state;
        const openItem = state.openItem === item ? null : item;
        if (openItem) {
            let transactionsPages = this.transactionsCache[openItem.name];
            if (!transactionsPages || !transactionsPages.length) {
                const transactions = await transactionService
                    .fetchArticle(openItem.name)
                    .then(mapTransactionViewModel);
                transactionsPages = [transactions];
                this.transactionsCache[openItem.name] = transactionsPages;
            }
            this.setState({
                openedArticleTransactions: transactionsPages[0],
                openItem,
                pageNumber: 0
            });
        } else {
            this.setState({
                openedArticleTransactions: [],
                openItem,
                pageNumber: 0
            });
        }
    }

    @bind
    firstPage() {
        this.setPage(0);
    }

    @bind
    prevPage() {
        if (this.state.pageNumber > 0) {
            this.setPage(this.state.pageNumber - 1);
        }
    }

    @bind
    nextPage() {
        this.setPage(this.state.pageNumber + 1);
    }

    async setPage(pageNumber: number) {
        const openItem = this.state.openItem;
        const transactionsPages = this.transactionsCache[openItem.name];
        let openedArticleTransactions = transactionsPages[pageNumber];
        if (openedArticleTransactions) {
            this.setState({
                pageNumber,
                openedArticleTransactions
            });
        } else {
            openedArticleTransactions = await transactionService
                .fetchArticle(openItem.name, 10, pageNumber * 10)
                .then(mapTransactionViewModel);
            const newPages = this.transactionsCache[openItem.name];
            newPages[pageNumber] = openedArticleTransactions;
            this.setState({
                pageNumber,
                openedArticleTransactions
            });
        }
    }

    renderSubTable(item: ArticleModel) {
        const { openItem, openedArticleTransactions } = this.state;
        const { wallets } = this.props;
        return (
            <tr key={item.name + "collapse"}>
                <td colSpan={5} style={{ padding: "0" }}>
                    <Collapse open={item === openItem}>
                        <div className="card" style={{ margin: "5px" }}>
                            <div className="card-body">
                                <TransactionTable wallets={wallets}
                                    items={openedArticleTransactions} rowColor={getDirectionColoring} />
                            </div>
                        </div>
                        <div className="card-footer">
                            <ul className="pagination justify-content-center">
                                <li className="page-item">
                                    <button className="page-link" type="button" onClick={this.firstPage}>First</button>
                                </li>
                                <li className="page-item">
                                    <button className="page-link" type="button" onClick={this.prevPage}>Previous</button>
                                </li>
                                <li className="page-item">
                                    <button className="page-link" type="button" onClick={this.nextPage}>Next</button>
                                </li>
                            </ul>
                        </div>
                    </Collapse>
                </td>
            </tr>
        );
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
            <Layout>
                <form onSubmit={noAction}>
                    <div className="form-group row">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Article</label>
                        <div className="col-sm-8">
                            <input type="name" className="form-control" id="name" name="name" placeholder="Search article..." value={name} onChange={this.handleInputChange} />
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
                    <tbody>
                        {articles.map(item => [this.renderTableRow(item), this.renderSubTable(item)])}
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

function mapStateToProps(state: RootState) {
    return {
        wallets: state.wallets
    };
}
