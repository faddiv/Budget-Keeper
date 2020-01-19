import React from "react";
import { SharedPriceListElement } from './SharedPriceListElement';
import { ISharedPrice, IPriceSharingDispatcher } from "./reducers";

interface SharedPriceListProps {
    model: ISharedPrice[];
    dispatch: IPriceSharingDispatcher;
}

export const SharedPriceList: React.FunctionComponent<SharedPriceListProps> = ({ model, dispatch }) => {
    return (
        <div className="list-group">
            {
                model.map(item => <SharedPriceListElement  key={item.id} model={item} dispatch={dispatch} />)
            }
        </div>
    );
};
