import React from "react";
import { PersonCostDetailElement } from './PersonCostDetailElement';
import { PersonCostDetailAdd } from './PersonCostDetailAdd';

interface PersonCostDetailsProps { }

export const PersonCostDetails: React.FunctionComponent<PersonCostDetailsProps> = () => {
    return (
        <ul className="list-group list-group-flush no-right-padding">
            <PersonCostDetailElement editable={false} />
            <PersonCostDetailElement editable={true} />
            <PersonCostDetailElement editable={true} />
            <PersonCostDetailAdd />
        </ul>
    );
};
