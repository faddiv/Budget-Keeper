import { createAction, handleActions } from "redux-actions";
import { BuyListModel } from "./BuyListModel";
import { BuyModel } from "./BuyModel";

namespace Actions {
    export namespace Items {
        export const add = "Items.Add";
    }
}

namespace ItemActions {
    export const addBuyItem = createAction<firebase.User>(Actions.Items.add);
}

const buyList = handleActions<BuyListModel, BuyModel>({
    [Actions.Items.add](state, action) {
        return { ...state, user: action.payload, singedIn: !!action.payload };
    }
}, { checklist: [] });

export {
    BuyModel,
    BuyListModel,
    ItemActions,
    buyList
};
