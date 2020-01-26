import React, { useCallback } from "react";
import { SharedPriceHeader } from './SharedPriceHeader';
import { ISharedPrice, IPriceSharingDispatcher } from "./reducers";
import { SharedPriceDetailElement } from './SharedPriceDetailElement';

interface SharedPriceListElementProps {
    model: ISharedPrice;
    dispatch: IPriceSharingDispatcher;
}

export const SharedPriceListElement: React.FunctionComponent<SharedPriceListElementProps> = ({ model, dispatch }) => {
    var sharedPriceId = model.id;
    const shareChangeHandler = useCallback((detailId: number, rawValue: string) => {
        dispatch.modifyPersonShareById(sharedPriceId, detailId, rawValue);
    }, [sharedPriceId, dispatch]);

    const priceChangedHandler = useCallback((rawValue: string) => {
        dispatch.modifySharePriceById(sharedPriceId, rawValue);
    }, [sharedPriceId, dispatch]);
    return (
        <div className="list-group-item">
            <SharedPriceHeader model={model} onPriceChanged={priceChangedHandler} />
            <ul className="list-group list-group-flush no-right-padding">
                {
                    model.details.map(item => <SharedPriceDetailElement key={item.id} model={item} onShareChanged={shareChangeHandler} />)
                }
            </ul>
        </div>
    );
};
