import React from "react";
import classNames from "classnames";
import { noop } from "../../helpers";
import { SharedPriceHeader } from './SharedPriceHeader';
import { SharedPriceDetails } from './SharedPriceDetails';

interface SharedPriceListElementProps { }

export const SharedPriceListElement: React.FunctionComponent<SharedPriceListElementProps> = () => {
    return (
        <div className="list-group-item">
            <SharedPriceHeader />
            <SharedPriceDetails />
        </div>
    );
};
