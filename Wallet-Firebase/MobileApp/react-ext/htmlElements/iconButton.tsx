import * as React from "react";
import { Icon, IconSize } from "./icon";

interface IconButtonProps {
    onClick: (evt: React.MouseEvent) => void;
    icon: string;
    size?: IconSize;
}

export const IconButton: React.SFC<IconButtonProps> = ({ onClick, icon, size }) => {
    return (
        <button className="btn btn-link" onClick={onClick}>
            <Icon name={icon} size={size} />
        </button>
    );
};
