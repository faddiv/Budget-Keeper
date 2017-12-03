import { Dispatch } from "redux";
import { Actions } from '../constants/actions';
import { Wallet, walletService } from "walletApi";
import { createAction } from "redux-actions";
import { showAlert } from "./alerts";

export const loadWalletSuccess = createAction<Wallet[]>(Actions.loadWallets);

export function loadWallets() {
    return async (dispatch: Dispatch<any>) => {
        try {
            var wallets = await walletService.getAll();
            dispatch(loadWalletSuccess(wallets));
        } catch (error) {
            dispatch(showAlert({type: "danger", message: error}));
        }
    }
}

export function insertWallet(wallet: Wallet) {
    return async (dispatch: Dispatch<any>) => {
        try {
            await walletService.insert(wallet);
            await loadWallets()(dispatch);
        } catch (error) {
            dispatch(showAlert({type: "danger", message: error}));
        }
    }
}

export function updateWallet(wallet: Wallet) {
    return async (dispatch: Dispatch<any>) => {
        try {
            await walletService.update(wallet);
            await loadWallets()(dispatch);
        } catch (error) {
            dispatch(showAlert({type: "danger", message: error}));
        }
    }
}

export function deleteWallet(wallet: Wallet) {
    return async (dispatch: Dispatch<any>) => {
        try {
            await walletService.delete(wallet);
            await loadWallets()(dispatch);
        } catch (error) {
            dispatch(showAlert({type: "danger", message: error}));
        }
    }
}