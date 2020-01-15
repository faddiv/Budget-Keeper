import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PersonCostHeaderProps { }

export const PersonCostHeader: React.FunctionComponent<PersonCostHeaderProps> = () => {
    return (
        <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">
                <button className="btn btn-danger btn-sm">
                    <FontAwesomeIcon icon="trash" />
                </button>
                <span className="sp-li-title">Viktor</span>
            </h5>
            <small>10000 ft</small>
        </div>
    );
};
