import React from "react";
import { PersonCostHeader } from './PersonCostHeader';
import { PersonCostDetails } from './PersonCostDetails';

interface PersonCostListElementProps {

}

export const PersonCostListElement: React.FunctionComponent<PersonCostListElementProps> = () => {
    return (
        <div className="list-group-item">
            <PersonCostHeader />
            <PersonCostDetails />
        </div>
    );
};
