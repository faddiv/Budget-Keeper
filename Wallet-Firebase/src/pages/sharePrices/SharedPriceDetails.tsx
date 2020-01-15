import React from "react";
import { SharedPriceDetailElement } from './SharedPriceDetailElement';
import { SharedPriceDetailAdd } from './SharedPriceDetailAdd';

interface SharedPriceDetailsProps { }

export const SharedPriceDetails: React.FunctionComponent<SharedPriceDetailsProps> = () => {
    return (
        <ul className="list-group list-group-flush no-right-padding">
            <SharedPriceDetailElement />
            <SharedPriceDetailElement />
            <SharedPriceDetailElement />
            <SharedPriceDetailAdd />
        </ul>
    );
};
