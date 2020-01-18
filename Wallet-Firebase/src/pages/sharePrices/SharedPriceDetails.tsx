import React from "react";
import { SharedPriceDetailElement } from './SharedPriceDetailElement';
import { SharedPriceDetailAdd } from './SharedPriceDetailAdd';
import { IDetailElement } from "./reducers";

interface SharedPriceDetailsProps {
    model: IDetailElement[];
}

export const SharedPriceDetails: React.FunctionComponent<SharedPriceDetailsProps> = ({ model }) => {
    return (
        <ul className="list-group list-group-flush no-right-padding">
            {
                model.map(item => <SharedPriceDetailElement  key={item.id} model={item} />)
            }
            <SharedPriceDetailAdd />
        </ul>
    );
};
