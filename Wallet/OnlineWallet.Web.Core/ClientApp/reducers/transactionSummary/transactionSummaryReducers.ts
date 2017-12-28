import { Action } from "redux";
import { _ } from "helpers";
import { handleActions } from "redux-actions";
import { Actions } from "constants/actions";
import { TransactionSummaryViewModel } from "actions/transactionsSummary";

export { TransactionSummaryViewModel };

export default handleActions<TransactionSummaryViewModel, TransactionSummaryViewModel>({
    [Actions.transactionsSelected](state, action) {
        return action.payload;
    }
}, []);
