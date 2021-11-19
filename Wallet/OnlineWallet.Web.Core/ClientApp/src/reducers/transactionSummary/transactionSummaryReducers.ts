import { handleActions } from "redux-actions";
import { Actions } from "../../constants/actions";
import { TransactionSummaryViewModel } from "../../actions/transactionsSummary";

export type { TransactionSummaryViewModel };

export default handleActions<TransactionSummaryViewModel, TransactionSummaryViewModel>({
    [Actions.transactionsSelected](_state, action) {
        return action.payload;
    }
}, []);
