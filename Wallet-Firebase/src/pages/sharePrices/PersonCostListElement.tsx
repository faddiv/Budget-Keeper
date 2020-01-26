import React, { useCallback } from "react";
import { PersonCostHeader } from './PersonCostHeader';
import { IPersonCost, IPriceSharingDispatcher } from "./reducers";
import { PersonCostDetailElement } from './PersonCostDetailElement';
import { PersonCostDetailAdd } from './PersonCostDetailAdd';

interface PersonCostListElementProps {
    model: IPersonCost;
    dispatch: IPriceSharingDispatcher;
}

export const PersonCostListElement: React.FunctionComponent<PersonCostListElementProps> = ({ model, dispatch }) => {

    const id = model.id;

    const onAddPersonCost = useCallback((name: string, price: number) => {
        dispatch.addPersonCost(model, name, price);
    }, [model, dispatch]);
    
    const deletePersonHandler = useCallback(() => {
        dispatch.deletePersonById(id);
    }, [id, dispatch]);

    return (
        <div className="list-group-item">
            <PersonCostHeader model={model} onDelete={deletePersonHandler} />
            <ul className="list-group list-group-flush no-right-padding">
                {
                    model.sharedPrices.map(item => <PersonCostDetailElement key={item.id} model={item} dispatch={dispatch} />)
                }
                {
                    model.details.map(item => <PersonCostDetailElement key={item.id} model={item} dispatch={dispatch} />)
                }
                <PersonCostDetailAdd onAddPersonCost={onAddPersonCost} />
            </ul>
        </div>
    );
};
