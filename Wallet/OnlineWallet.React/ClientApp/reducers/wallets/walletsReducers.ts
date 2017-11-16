
import { handleActions } from "redux-actions";
import { Actions } from "constants/actions";
import { Wallet } from "walletApi";

export type WalletsModel = Wallet[];

export default handleActions<WalletsModel, WalletsModel>({
    [Actions.loadWallets](state, action) {
        return action.payload;
    }
}, []);