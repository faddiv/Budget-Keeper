import React from "react";
import { SharedPriceListElement } from './SharedPriceListElement';
import { ISharedPrice } from "./reducers";

interface SharedPriceListProps {
    model: ISharedPrice[];
}

export const SharedPriceList: React.FunctionComponent<SharedPriceListProps> = ({ model }) => {
    return (
        <div className="list-group">
            {
                model.map(item => <SharedPriceListElement  key={item.id} model={item} />)
            }
        </div>
    );
};
