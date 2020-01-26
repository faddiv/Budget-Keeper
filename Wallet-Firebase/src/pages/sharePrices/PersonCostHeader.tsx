import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IPersonCost } from "./reducers";

interface PersonCostHeaderProps {
    model: IPersonCost;
}

export const PersonCostHeader: React.FunctionComponent<PersonCostHeaderProps> = ({ model }) => {
    return (
        <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">
                <button className="btn btn-danger btn-sm">
                    <FontAwesomeIcon icon="trash" />
                </button>
                <span className="sp-li-title">{model.personName}</span>
            </h5>
            <small><strong>{model.expense} ft</strong></small>
        </div>
    );
};
