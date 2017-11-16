import { Dispatch } from "redux";
import { Actions } from '../constants/actions';
import { Wallet, walletService } from "walletApi";
import { createAction } from "redux-actions";

export const loadWalletSuccess = createAction<Wallet[]>(Actions.loadWallets);

export function loadWallets() {
    return async (dispatch: Dispatch<any>) => {
        try {
            var wallets = await walletService.getAll();
            dispatch(loadWalletSuccess(wallets));
        } catch (error) {

        }
    }
}