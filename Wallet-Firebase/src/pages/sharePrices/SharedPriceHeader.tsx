import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SharedPriceHeaderProps { }

export const SharedPriceHeader: React.FunctionComponent<SharedPriceHeaderProps> = () => {
    return (
        <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">
                <button className="btn btn-danger btn-sm">
                    <FontAwesomeIcon icon="trash" />
                </button>
                <span className="sp-li-title">Billiárd</span>
            </h5>
            <input className="borderless small" placeholder="Price" />
        </div>
    );
};
