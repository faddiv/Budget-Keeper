import * as React from "react";
import { MoneyDirection } from "walletApi";

interface DirectionIconProps {
    direction: MoneyDirection;
}

export const DirectionIcon: React.SFC<DirectionIconProps> = ({ direction, ...rest }) => {
    return (
        <span className={directionCssClass(direction)}></span>
    );
};

function directionCssClass(direction: MoneyDirection) {
    switch (direction) {
        case -1:
            return "fa fa-minus text-danger";
        case 1:
            return "fa fa-plus text-success";
        default:
            return "fa fa-bookmark";
    }
}
