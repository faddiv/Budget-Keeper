import * as React from "react";
import { render, mount } from "enzyme";
import "jest-enzyme";

import { TransactionTable } from "./transaction-table";
import { unwrap } from "helpers/testHelpers";
import { TransactionSummaryActions } from "actions/transactionsSummary";
import { AlertsActions } from "actions/alerts";
import { createAlertsActionsMock } from "actions/alerts.mocks";
import { createTransactionSummaryActionsMocks } from "actions/transactionsSummary.mocks";
import { Wallet } from "walletApi";
import { TransactionViewModel, getDirectionColoring } from "walletCommon";

describe("TransactionSummary", () => {
    const TransactionTable2 = unwrap(TransactionTable);
    let summaryActions: typeof TransactionSummaryActions;
    let alertActions: typeof AlertsActions;
    const wallets: Wallet[] = [
        {
            moneyWalletId: 1,
            name: "Cash"
        }, {
            moneyWalletId: 2,
            name: "BankAccount"
        }
    ];

    beforeEach(() => {
        summaryActions = createTransactionSummaryActionsMocks();
        alertActions = createAlertsActionsMock();
    });

    it("should display transaction rows", () => {
        const items: TransactionViewModel[] = createTransactions(4);
        const element = render(<TransactionTable2 alertActions={alertActions}
            summaryActions={summaryActions} items={items} wallets={wallets}
            transactionSummary={[]} rowColor={getDirectionColoring} />);

        expect(element).toMatchSnapshot();
    });

    it("should highlight selected in summary rows", () => {
        const items: TransactionViewModel[] = createTransactions(4);
        const transactionSummary = items.slice(1, 3);

        const element = mount(<TransactionTable2 alertActions={alertActions}
            summaryActions={summaryActions} items={items} wallets={wallets}
            transactionSummary={transactionSummary} rowColor={getDirectionColoring} />);

        const rows = element.find("tbody tr");
        expect(rows.length).toBe(4);
        expect(rows.at(0)).not.toHaveClassName("selected");
        expect(rows.at(1)).toHaveClassName("selected");
        expect(rows.at(2)).toHaveClassName("selected");
        expect(rows.at(3)).not.toHaveClassName("selected");
    });
});

function createTransactions(size: number = 4) {
    return [
        { key: 1, transactionId: 1, name: "apple", category: "grocery", comment: "Hy", createdAt: "2018-05-26", price: "123", direction: -1, walletId: 1 },
        { key: 2, transactionId: 2, name: "payment", category: "incomes", comment: "Got it", createdAt: "2018-05-27", price: "30000", direction: 1, walletId: 2 },
        { key: 3, transactionId: 3, name: "detergent", category: "cleaning", comment: "for cleaning", createdAt: "2018-05-27", price: "100", direction: -1, walletId: 1 },
        { key: 4, transactionId: 4, name: "movie ticket", category: "fun", comment: "good movie", createdAt: "2018-05-28", price: "1000", direction: 0, walletId: 2 }
    ].slice(0, size);
}
