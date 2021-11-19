import * as React from "react";
import { bind } from "bind-decorator";

import { CategoryStatistics, Wallet, transactionService } from "../../../walletApi";
import { formatInt } from "../../../helpers";
import { DetailsTable } from "./detailsTable";
import { mapTransactionViewModel, TransactionViewModel } from "../../../walletCommon";

export interface CategoryTableProps {
    categories: CategoryStatistics[];
    wallets: Wallet[];
    startDate?: string;
    endDate?: string;
}

export interface CategoryTableState {
    openItem: CategoryStatistics | null;
}

export class CategoryTable extends React.Component<CategoryTableProps, CategoryTableState> {

    constructor(props: CategoryTableProps) {
        super(props);
        this.state = {
            openItem: null
        };
    }

    @bind
    async queryDetails(parentRow: CategoryStatistics, take: number, skip: number): Promise<TransactionViewModel[]> {
        const { startDate, endDate } = this.props;
        const transactions = await transactionService.fetchCategory(parentRow.name, {
            limit: take,
            skip,
            start: startDate,
            end: endDate
        }).then(mapTransactionViewModel);
        return transactions;
    }

    @bind
    async toggleDetails(parentRow: CategoryStatistics, open: boolean) {
        this.setState({
            openItem: open ? parentRow : null
        });
    }

    @bind
    async openRow(item: CategoryStatistics) {
        this.setState((prevState) => {
            return {
                openItem: prevState.openItem === item ? null : item
            };
        });
    }

    render() {
        const { categories, wallets } = this.props;
        const { openItem } = this.state;
        return (
            <table className="table category-statistics">
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Count</td>
                        <td>Spent</td>
                        <td>Spent percent</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(item => [(
                        <tr key={item.name} onClick={() => this.openRow(item)}>
                            <td>{item.name}</td>
                            <td>{formatInt(item.count)}</td>
                            <td>{formatInt(item.spent)}</td>
                            <td>{item.spentPercent.toLocaleString("en", { style: "percent", maximumFractionDigits: 2 })}</td>
                        </tr>
                    ), (
                        <DetailsTable key={item.name + " collapse"} colSpan={4} open={item === openItem} parentRow={item} wallets={wallets} queryDetails={this.queryDetails} toggleDetails={this.toggleDetails} />
                    )])}
                </tbody>
            </table>
        );
    }
}
