import React from "react";

interface SharedPriceDetailElementProps { }

export const SharedPriceDetailElement: React.FunctionComponent<SharedPriceDetailElementProps> = () => {
    return (
        <li className="list-group-item d-flex justify-content-between">
            <div>Viktor</div><input style={{minWidth: "60px"}} className="borderless small" type="time" />
        </li>
    );
};
