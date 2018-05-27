import * as React from "react";
import * as H from "history";
import { shallow } from "enzyme";

import { TransactionSummary } from "./transaction-summary";
import { unwrap } from "helpers/testHelpers";
import { MoneyDirection } from "walletApi";
import { TransactionSummaryActions } from "actions/transactionsSummary";
import { TransactionViewModel } from "walletCommon";
import { createTransactionSummaryActionsMocks } from "actions/transactionsSummary.mocks";

describe("TransactionSummary", () => {
    const TransactionSummary2 = unwrap(TransactionSummary);
    let defaultHistory: H.History;
    let actions: typeof TransactionSummaryActions;

    beforeEach(() => {
        defaultHistory = H.createMemoryHistory();
        actions = createTransactionSummaryActionsMocks();
    });

    it("should sum incomes", () => {
        const summary: TransactionViewModel[] = [{
            direction: MoneyDirection.Income,
            price: "100"
        }, {
            direction: MoneyDirection.Income,
            price: "50"
        }, {
            direction: MoneyDirection.Expense,
            price: "50"
        }];

        const element = shallow(<TransactionSummary2 actions={actions} history={defaultHistory} transactionSummary={summary} />);

        expect(element).toBeDefined();
        expect(element.html()).toContain("Incomes: 150");
        expect(element).toMatchSnapshot();
    });

    it("should sum expenses", () => {
        const summary: TransactionViewModel[] = [{
            direction: MoneyDirection.Expense,
            price: "100"
        }, {
            direction: MoneyDirection.Expense,
            price: "50"
        }, {
            direction: MoneyDirection.Plan,
            price: "50"
        }];

        const element = shallow(<TransactionSummary2 actions={actions} history={defaultHistory} transactionSummary={summary} />);

        expect(element).toBeDefined();
        expect(element.html()).toContain("Expenses: 150");
        expect(element).toMatchSnapshot();
    });

    it("should sum plans", () => {
        const summary: TransactionViewModel[] = [{
            direction: MoneyDirection.Plan,
            price: "100"
        }, {
            direction: MoneyDirection.Plan,
            price: "50"
        }, {
            direction: MoneyDirection.Income,
            price: "50"
        }];

        const element = shallow(<TransactionSummary2 actions={actions} history={defaultHistory} transactionSummary={summary} />);

        expect(element).toBeDefined();
        expect(element.html()).toContain("Plans: 150");
        expect(element).toMatchSnapshot();
    });

    it("should call transactionsSelected with empty list when navigation occur", () => {
        const summary: TransactionViewModel[] = [{
            direction: MoneyDirection.Expense,
            price: "100"
        }, {
            direction: MoneyDirection.Plan,
            price: "50"
        }, {
            direction: MoneyDirection.Income,
            price: "50"
        }];

        const element = shallow(<TransactionSummary2 actions={actions} history={defaultHistory} transactionSummary={summary} />);
        defaultHistory.push("/otherLink");

        expect(element).toBeDefined();
        expect(actions.transactionsSelected).toBeCalledWith([]);
    });

    it("should render nothing with empty list", () => {
        const summary: TransactionViewModel[] = [];

        const element = shallow(<TransactionSummary2 actions={actions} history={defaultHistory} transactionSummary={summary} />);

        expect(element.html()).toBe(null);
    });
});
