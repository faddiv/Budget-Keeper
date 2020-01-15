import React from "react";
import { PersonCostListElement } from './PersonCostListElement';

interface PersonCostListProps {

}

export const PersonCostList: React.FunctionComponent<PersonCostListProps> = () => {
    return (

        <div className="list-group">

            <PersonCostListElement />

            <PersonCostListElement />

            <PersonCostListElement />
        </div>
    );
};
