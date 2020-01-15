import React from "react";
import classNames from "classnames";

interface PersonCostDetailElementProps {
    editable: boolean;
}

export const PersonCostDetailElement: React.FunctionComponent<PersonCostDetailElementProps> = ({ editable }) => {
    return (
        <li className={classNames("list-group-item d-flex justify-content-between", { "list-group-item-light": !editable })}>
            <div>Cras justo odio</div>
            {editable
                ? <input className="borderless small" value="1000" />
                : <small>1000</small>}
        </li>
    );
};
