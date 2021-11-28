import { handleActions } from "redux-actions";
import { Actions } from "../../constants/actions";
import { TransactionSummaryViewModel } from "../../actions/transactionsSummary";

export type { TransactionSummaryViewModel };

export default handleActions<TransactionSummaryViewModel, TransactionSummaryViewModel>(
  {
    [Actions.transactionsSelected](_state, action) {
      if (_state.length === 0 && action.payload.length === 0) {
        return _state;
      }
      return action.payload;
    },
  },
  []
);
