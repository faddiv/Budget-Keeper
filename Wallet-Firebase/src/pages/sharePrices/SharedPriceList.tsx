import React from "react";
import { SharedPriceListElement } from './SharedPriceListElement';

interface SharedPriceListProps {

}

export const SharedPriceList: React.FunctionComponent<SharedPriceListProps> = () => {
    return (
        <div className="list-group">
            <SharedPriceListElement />
            <SharedPriceListElement />
        </div>
    );
};
