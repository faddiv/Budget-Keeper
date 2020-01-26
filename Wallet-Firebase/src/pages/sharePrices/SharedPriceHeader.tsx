import React, { useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ISharedPrice } from "./reducers";

interface SharedPriceHeaderProps {
    model: ISharedPrice;
    onPriceChanged(rawValue: string): void;
    onDelete(): void;
}

export const SharedPriceHeader: React.FunctionComponent<SharedPriceHeaderProps> = ({ model, onPriceChanged, onDelete }) => {
    const changeHandler = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = evt.target.value;
        onPriceChanged(rawValue);
    }, [onPriceChanged]);
    return (
        <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">
                <button className="btn btn-danger btn-sm" onClick={onDelete} >
                    <FontAwesomeIcon icon="trash" />
                </button>
                <span className="sp-li-title">{model.activityName}</span>
            </h5>
            <input className="borderless small" type="number" placeholder="Price" value={model.price} onChange={changeHandler} />
        </div>
    );
};
