import * as React from "react";
import { render, mount, HTMLAttributes, ReactWrapper } from "enzyme";
import "jest-enzyme";

import { TransactionTable } from "./transaction-table";
import { unwrap, createTransactions, simulateEvent, simulateInputChange } from "react-ext/testHelpers";
import { TransactionSummaryActions } from "actions/transactionsSummary";
import { AlertsActions } from "actions/alerts";
import { createAlertsActionsMock } from "actions/alerts.mocks";
import { createTransactionSummaryActionsMocks } from "actions/transactionsSummary.mocks";
import { Wallet } from "walletApi";
import { TransactionViewModel, getDirectionColoring } from "walletCommon";

describe("TransactionTable", () => {
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

    it("should highligh rows with mouse down move, move and up", () => {
        const items: TransactionViewModel[] = createTransactions(4);
        const transactionSummary = [];

        const element = mount(<TransactionTable2 alertActions={alertActions}
            summaryActions={summaryActions} items={items} wallets={wallets}
            transactionSummary={transactionSummary} rowColor={getDirectionColoring} />);

        const rows = element.find("tbody tr");

        // Mouse down on the second row.
        simulateEvent(rows.at(1), "mousedown");
        const selection = items.slice(1, 2);
        expect(summaryActions.transactionsSelected).toHaveBeenCalledWith(selection);
        (summaryActions.transactionsSelected as jasmine.Spy).calls.reset();
        // reducer sets the transactionSummary
        element.setProps({
            transactionSummary: selection
        });

        // moving to the third row.
        simulateEvent(rows.at(2), "mouseenter");
        expect(summaryActions.transactionsSelected).toHaveBeenCalledWith(items.slice(1, 3));
        (summaryActions.transactionsSelected as jasmine.Spy).calls.reset();

        // Releasing the mouse we stop the selection mode.
        simulateEvent(rows.at(2), "mouseup");
        simulateEvent(rows.at(3), "mouseenter");
        expect(summaryActions.transactionsSelected).not.toHaveBeenCalled();
    });

    it("should switch edit mode with edit button", () => {
        const items: TransactionViewModel[] = createTransactions(2);
        const transactionSummary = [];

        const element = mount(<TransactionTable2 alertActions={alertActions}
            summaryActions={summaryActions} items={items} wallets={wallets}
            transactionSummary={transactionSummary} rowColor={getDirectionColoring} update={() => { }} />);

        const rows = element.find("tbody tr");
        const editedRow = rows.at(1);
        const editButton = editedRow.find(".btn-edit");
        simulateEvent(editButton, "click");

        const tbody = element.find("tbody");
        expect(tbody.render()).toMatchSnapshot();
    });

    it("should switch into edit mode with edit button", () => {
        const items: TransactionViewModel[] = createTransactions(2);

        const element = mount(<TransactionTable2 alertActions={alertActions}
            summaryActions={summaryActions} items={items} wallets={wallets}
            transactionSummary={[]} rowColor={getDirectionColoring} update={() => { }} />);

        clickButtonAtLine(element, 1, ".btn-edit");

        const tbody = element.find("tbody");
        expect(tbody.render()).toMatchSnapshot();
    });

    it("should call update when edit and save", () => {
        const items: TransactionViewModel[] = createTransactions(2);
        const updateSpy = jasmine.createSpy("updateSpy");

        const element = mount(<TransactionTable2 alertActions={alertActions}
            summaryActions={summaryActions} items={items} wallets={wallets}
            transactionSummary={[]} rowColor={getDirectionColoring} update={updateSpy} changedItems={[]} />);

        clickButtonAtLine(element, 1, ".btn-edit");

        const priceInput = selectRow(element, 1).find('[name="price"]');
        simulateInputChange(priceInput, "321");

        clickButtonAtLine(element, 1, ".btn-save");

        expect(updateSpy).toHaveBeenCalled();
        const changes: TransactionViewModel[] = updateSpy.calls.mostRecent().args[1];
        expect(changes).toBeDefined();
        expect(changes).toHaveLength(1);
        expect(changes[0].price).toBe("321");
    });
});

function clickButtonAtLine(element: ReactWrapper<any, any>, at: number, btn: string) {
    const editedRow = selectRow(element, at);
    const editButton = editedRow.find(btn);
    simulateEvent(editButton, "click");
}

function selectRow(element: ReactWrapper<any, any>, at: number): ReactWrapper<HTMLAttributes, any> {
    const rows = element.find("tbody tr");
    const editedRow = rows.at(at);
    return editedRow;
}
