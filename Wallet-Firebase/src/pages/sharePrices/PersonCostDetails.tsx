import React from "react";
import { PersonCostDetailElement } from './PersonCostDetailElement';
import { PersonCostDetailAdd } from './PersonCostDetailAdd';
import { IDetailElement } from 'walletServices/priceShareServices';

interface PersonCostDetailsProps {
    model: IDetailElement[];
}

export const PersonCostDetails: React.FunctionComponent<PersonCostDetailsProps> = ({ model }) => {
    return (
        <ul className="list-group list-group-flush no-right-padding">
            {
                model.map(item => <PersonCostDetailElement key={item.id} model={item} />)
            }
            <PersonCostDetailAdd />
        </ul>
    );
};
