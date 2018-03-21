import * as React from "react";
import { connect } from "react-redux";
import { bind } from "bind-decorator";

import { Layout } from "layout";
import { ArticleModel, articleService, Wallet, transactionService } from "walletApi";
import { updateState, Collapse, noAction } from "react-ext";
import { getWalletNameById, TransactionViewModel, mapTransactionViewModel, getDirectionColoring, TransactionTable } from "walletCommon";
import { RootState } from "reducers";

interface OpenedArticles {
    [name: string]: TransactionViewModel[][];
}

export interface ArticlesPageProps {
    wallets: Wallet[];
}

export interface ArticlesPageState {
    articles: ArticleModel[];
    name: string;
    openItem: ArticleModel;
    openedArticleTransactions: TransactionViewModel[];
    transactionsCache: OpenedArticles;
    pageNumber: number;
}

@connect(mapStateToProps, undefined)
export class ArticlesPage extends React.Component<ArticlesPageProps, ArticlesPageState> {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            name: "",
            openItem: null,
            openedArticleTransactions: [],
            transactionsCache: {},
            pageNumber: 0
        };
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
    async openRow(item: ArticleModel) {
        const state = this.state;
        const openItem = state.openItem === item ? null : item;
        console.log("openRow 1", this.state);
        if (openItem) {
            let transactionsPages = state.transactionsCache[openItem.name];
            if (!transactionsPages || !transactionsPages.length) {
                const transactions = await transactionService
                    .fetchArticle(openItem.name)
                    .then(mapTransactionViewModel);
                console.log("openRow 2", this.state);
                transactionsPages = [transactions];
                this.setState((prevState) => {
                    console.log("openRow settingState", prevState);
                    return {
                        transactionsCache: { ...prevState.transactionsCache, [openItem.name]: transactionsPages }
                    };
                }, () => {
                    console.log("openRow settingState finished", this.state);
                });
            }
            console.log("openRow 3", this.state);
            this.setState({
                openedArticleTransactions: transactionsPages[0],
                openItem,
                pageNumber: 0
            });
        } else {
            console.log("openRow 4", this.state);
            this.setState({
                openedArticleTransactions: [],
                openItem,
                pageNumber: 0
            });
        }
        console.log("openRow 5", this.state);
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
        const transactionsPages = this.state.transactionsCache[openItem.name];
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
            this.setState((prevState) => {
                const newPages = [...prevState.transactionsCache[openItem.name]];
                newPages[pageNumber] = openedArticleTransactions;
                return {
                    pageNumber,
                    openedArticleTransactions,
                    transactionsCache: { ...prevState.transactionsCache, [openItem.name]: newPages }
                };
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
        const { name, articles } = this.state;
        console.log("rendering", this.state, "props", this.props);
        return (
            <Layout>
                <form onSubmit={noAction}>
                    <div className="form-group row">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Article</label>
                        <div className="col-sm-10">
                            <input type="name" className="form-control" id="name" name="name" placeholder="Search article..." value={name} onChange={this.handleInputChange} />
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

function mapStateToProps(state: RootState) {
    return {
        wallets: state.wallets
    };
}
