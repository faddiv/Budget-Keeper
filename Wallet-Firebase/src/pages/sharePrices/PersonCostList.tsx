import React from "react";
import { PersonCostListElement } from './PersonCostListElement';
import { IPersonCost } from 'walletServices/priceShareServices';

interface PersonCostListProps {
    model: IPersonCost[]
}

export const PersonCostList: React.FunctionComponent<PersonCostListProps> = ({ model }) => {
    return (

        <div className="list-group">
            {
                model.map(item => <PersonCostListElement key={item.id} model={item} />)
            }
        </div>
    );
};
