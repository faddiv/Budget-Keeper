import React, { useCallback } from "react";
import { SharedPriceHeader } from './SharedPriceHeader';
import { ISharedPrice, IPriceSharingDispatcher } from "./reducers";
import { SharedPriceDetailAdd } from './SharedPriceDetailAdd';
import { SharedPriceDetailElement } from './SharedPriceDetailElement';

interface SharedPriceListElementProps {
    model: ISharedPrice;
    dispatch: IPriceSharingDispatcher;
}

export const SharedPriceListElement: React.FunctionComponent<SharedPriceListElementProps> = ({ model, dispatch }) => {
    const addPersonHandler = useCallback((name: string, price: number) => {
        dispatch.addPersonToSharedCost(model, name, price);
    }, [model]);

    return (
        <div className="list-group-item">
            <SharedPriceHeader model={model} />
            <ul className="list-group list-group-flush no-right-padding">
                {
                    model.details.map(item => <SharedPriceDetailElement key={item.id} model={item} />)
                }
                <SharedPriceDetailAdd onAddPersonToSharedPrice={addPersonHandler} />
            </ul>
        </div>
    );
};
