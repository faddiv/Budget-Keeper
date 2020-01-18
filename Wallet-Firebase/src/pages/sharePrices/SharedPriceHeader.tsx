import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ISharedPrice } from "./reducers";
import { noop } from "helpers";

interface SharedPriceHeaderProps {
    model: ISharedPrice;
}

export const SharedPriceHeader: React.FunctionComponent<SharedPriceHeaderProps> = ({ model }) => {
    return (
        <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">
                <button className="btn btn-danger btn-sm">
                    <FontAwesomeIcon icon="trash" />
                </button>
                <span className="sp-li-title">{model.activityName}</span>
            </h5>
            <input className="borderless small" type="number" placeholder="Price" value={model.price} onChange={noop} />
        </div>
    );
};
