import React from "react";
import { SharedPriceHeader } from './SharedPriceHeader';
import { SharedPriceDetails } from './SharedPriceDetails';
import { ISharedPrice } from "./reducers";

interface SharedPriceListElementProps {
    model: ISharedPrice;
}

export const SharedPriceListElement: React.FunctionComponent<SharedPriceListElementProps> = ({ model }) => {
    return (
        <div className="list-group-item">
            <SharedPriceHeader model={model} />
            <SharedPriceDetails model={model.details} />
        </div>
    );
};
