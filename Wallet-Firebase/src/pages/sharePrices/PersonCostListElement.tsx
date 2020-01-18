import React from "react";
import { PersonCostHeader } from './PersonCostHeader';
import { PersonCostDetails } from './PersonCostDetails';
import { IPersonCost } from "./reducers";

interface PersonCostListElementProps {
    model: IPersonCost
}

export const PersonCostListElement: React.FunctionComponent<PersonCostListElementProps> = ({ model }) => {
    return (
        <div className="list-group-item">
            <PersonCostHeader model={model} />
            <PersonCostDetails model={model.details} />
        </div>
    );
};
