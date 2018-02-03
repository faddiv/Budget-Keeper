import * as React from "react";
import { Layout } from "layout";
import { ArticleModel, articleService, Wallet, transactionService } from "walletApi";
import { bind, _ } from "helpers";
import { updateState, Collapse, noAction } from "react-ext";
import { getWalletNameById, TransactionViewModel, mapTransactionViewModel, getDirectionColoring, TransactionTable } from "walletCommon";
import { connect } from "react-redux";
import { RootState } from "reducers";

interface OpenedArticles {
    [name: string]: TransactionViewModel[];
}

export namespace ArticlesPage {
    export interface Props {
        wallets: Wallet[];
    }
    export interface State {
        articles: ArticleModel[];
        name: string;
        openItem: ArticleModel;
        openedArticleTransactions: TransactionViewModel[];
        transactionsCache: OpenedArticles;
    }
}

@connect(mapStateToProps, undefined)
export class ArticlesPage extends React.Component<ArticlesPage.Props, ArticlesPage.State> {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            name: "",
            openItem: null,
            openedArticleTransactions: [],
            transactionsCache: {}
        };
    }

    @bind
    deleteItem(item: TransactionViewModel) {
        this.setState((prevState, props) => {
            return {
                openedArticleTransactions: _.remove(prevState.openedArticleTransactions, item)
            };
        });
    }

    @bind
    update(openedArticleTransactions: TransactionViewModel[], changedItems: TransactionViewModel[]): void {
        this.setState({
            openedArticleTransactions
        });
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
        this.setState({
            openItem
        });
        if (openItem) {
            let transactions = state.transactionsCache[openItem.name];
            if (!transactions || !transactions.length) {
                transactions = await transactionService
                    .fetchArticle(openItem.name)
                    .then(mapTransactionViewModel);
                this.setState((prevState, props) => {
                    return {
                        transactionsCache: { ...prevState.transactionsCache, [openItem.name]: transactions }
                    };
                });
            }
            this.setState({
                openedArticleTransactions: transactions
            });
        } else {
            this.setState({
                openedArticleTransactions: []
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
                                    items={openedArticleTransactions} rowColor={getDirectionColoring}
                                    deleted={this.deleteItem} update={this.update} />
                            </div>
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
        const { wallets } = this.props;
        const { name, articles, openItem } = this.state;
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
                            <td>Name</td>
                            <td>Category</td>
                            <td>Last price</td>
                            <td>Last wallet</td>
                            <td>Occurence</td>
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

function mapStateToProps(state: RootState, ownProps: any) {
    return {
        wallets: state.wallets
    };
}
