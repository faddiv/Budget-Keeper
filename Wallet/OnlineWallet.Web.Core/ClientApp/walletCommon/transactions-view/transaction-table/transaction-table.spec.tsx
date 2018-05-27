import * as React from "react";
import { render, mount } from "enzyme";

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
        const items: TransactionViewModel[] = [
            { key: 1, transactionId: 1, name: "alfa", category: "grocery", comment: "Hy", createdAt: "2018-05-26", price: "123", direction: -1, walletId: 1 },
            { key: 2, transactionId: 2, name: "beta", category: "salary", comment: "Got it", createdAt: "2018-05-27", price: "3000", direction: 1, walletId: 2 }
        ];
        const element = render(<TransactionTable2 alertActions={alertActions}
            summaryActions={summaryActions} items={items} wallets={wallets}
            transactionSummary={[]} rowColor={getDirectionColoring} />);

        expect(element).toMatchSnapshot();
    });
});
