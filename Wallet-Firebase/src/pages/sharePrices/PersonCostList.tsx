import React from "react";
import { PersonCostListElement } from './PersonCostListElement';
import { IPersonCost, IPriceSharingDispatcher } from "./reducers";

interface PersonCostListProps {
    model: IPersonCost[];
    dispatch: IPriceSharingDispatcher;
}

export const PersonCostList: React.FunctionComponent<PersonCostListProps> = ({ model, dispatch }) => {
    return (

        <div className="list-group">
            {
                model.map(item => <PersonCostListElement key={item.id} model={item} dispatch={dispatch} />)
            }
        </div>
    );
};
