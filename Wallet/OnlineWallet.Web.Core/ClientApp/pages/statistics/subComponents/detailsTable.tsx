import * as React from "react";
import { TransactionViewModel, TransactionTable, getDirectionColoring } from "walletCommon";
import { Wallet } from "walletApi";
import { bind } from "bind-decorator";
import { Collapse } from "react-ext";

export interface DetailsTableProps {
    parentRow: any;
    colSpan: number;
    queryDetails: (parentRow: any, take: number, skip: number) => Promise<TransactionViewModel[]>;
    toggleDetails: (parentRow: any, open: boolean) => void;
    wallets: Wallet[];
    open: boolean;
}

export interface DetailsTableState {
    openedArticleTransactions: TransactionViewModel[];
    page: number;
    pageSize: number;
    open: boolean;
}

export class DetailsTable extends React.Component<DetailsTableProps, DetailsTableState> {
    constructor(props: DetailsTableProps) {
        super(props);
        this.state = {
            openedArticleTransactions: [],
            page: 1,
            pageSize: 10,
            open: props.open
        };
    }

    async componentWillReceiveProps?(nextProps: Readonly<DetailsTableProps>) {
        if (this.props.open !== nextProps.open) {
            if (nextProps.open) {
                this.setPage(1, nextProps.parentRow);
            } else {
                this.setState({
                    openedArticleTransactions: [],
                    page: 1,
                    open: false
                });
            }
        }
    }

    @bind
    toggleDetails() {
        this.props.toggleDetails(this.props.parentRow, !this.props.open);
    }

    @bind
    async firstPage() {
        await this.setPage(1, this.props.parentRow);
    }

    @bind
    async prevPage() {
        if (this.state.page > 1) {
            await this.setPage(this.state.page - 1, this.props.parentRow);
        }
    }

    @bind
    async nextPage() {
        await this.setPage(this.state.page + 1, this.props.parentRow);
    }

    async setPage(page: number, parentRow: any) {
        const openedArticleTransactions = await this.props.queryDetails(parentRow, this.state.pageSize, (page - 1) * this.state.pageSize);
        this.setState({
            openedArticleTransactions,
            page,
            open: true
        });
    }

    render() {
        const { wallets, colSpan } = this.props;
        const { openedArticleTransactions, open } = this.state;
        return (
            <tr>
                <td colSpan={colSpan} style={{ padding: "0" }}>
                    <Collapse open={open}>
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
}
