import * as React from "react";
import { Layout } from "layout";
import { ArticleModel, articleService, Wallet } from "walletApi";
import { bind } from "helpers";
import { updateState, Collapse } from "react-ext";
import { getWalletNameById } from "walletCommon";
import { connect } from "react-redux";
import { RootState } from "reducers";

export namespace ArticlesPage {
    export interface Props {
        wallets: Wallet[];
    }
    export interface State {
        articles: ArticleModel[];
        name: string;
        openItem: ArticleModel;
    }
}

@connect(mapStateToProps, undefined)
export class ArticlesPage extends React.Component<ArticlesPage.Props, ArticlesPage.State> {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            name: "",
            openItem: null
        };
    }

    @bind
    async handleInputChange(event: React.SyntheticEvent<HTMLInputElement>) {
        const state = updateState(event);
        if (state.name) {
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
    openRow(item: ArticleModel) {
        this.setState((prevState, props) => {
            return {
                openItem: prevState.openItem === item ? null : item
            };
        });
    }

    render() {
        const { wallets } = this.props;
        const { name, articles, openItem } = this.state;
        return (
            <Layout>
                <form>
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
                        {articles.map(item => (
                            [<tr key={item.name} onClick={() => this.openRow(item)}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.lastPrice}</td>
                                <td>{getWalletNameById(item.lastWallet, wallets)}</td>
                                <td>{item.occurence}</td>
                            </tr>,
                            <tr key={item.name + "collapse"}>
                                <td colSpan={5} style={{ padding: "0" }}>
                                    <Collapse open={item === openItem}>
                                        <div className="card" style={{ margin: "5px" }}>
                                            <div className="card-body">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <td>x</td>
                                                            <td>c</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>x</td>
                                                            <td>c</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </Collapse>
                                </td>
                            </tr>]
                        ))}
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
