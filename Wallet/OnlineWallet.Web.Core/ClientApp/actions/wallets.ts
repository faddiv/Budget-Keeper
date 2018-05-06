import { Dispatch } from "redux";
import { Actions } from "../constants/actions";
import { Wallet, walletService } from "walletApi";
import { createAction } from "redux-actions";
import { AlertsActions } from "./alerts";

export const loadWalletSuccess = createAction<Wallet[]>(Actions.loadWallets);

export function loadWallets() {
    return async (dispatch: Dispatch<any>) => {
        try {
            const wallets = await walletService.getAll();
            dispatch(loadWalletSuccess(wallets));
        } catch (error) {
            dispatch(AlertsActions.showAlert({type: "danger", message: error.message}));
        }
    };
}

export function insertWallet(wallet: Wallet) {
    return async (dispatch: Dispatch<any>) => {
        try {
            await walletService.insert(wallet);
            await loadWallets()(dispatch);
        } catch (error) {
            dispatch(AlertsActions.showAlert({type: "danger", message: error.message}));
        }
    };
}

export function updateWallet(wallet: Wallet) {
    return async (dispatch: Dispatch<any>) => {
        try {
            await walletService.update(wallet);
            await loadWallets()(dispatch);
        } catch (error) {
            dispatch(AlertsActions.showAlert({type: "danger", message: error}));
        }
    };
}

export function deleteWallet(wallet: Wallet) {
    return async (dispatch: Dispatch<any>) => {
        try {
            await walletService.delete(wallet);
            await loadWallets()(dispatch);
        } catch (error) {
            dispatch(AlertsActions.showAlert({type: "danger", message: error}));
        }
    };
}
