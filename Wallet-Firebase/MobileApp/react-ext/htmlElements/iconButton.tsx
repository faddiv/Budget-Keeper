import React from "react";
import { Icon, IconSize } from "./icon";

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "size"> {
    onClick: (evt: React.MouseEvent) => void;
    icon: string;
    size?: IconSize;
    title?: string;
}

export const IconButton: React.SFC<IconButtonProps> = ({ onClick, icon, size, ...rest }) => {
    return (
        <button className="btn btn-link" onClick={onClick} {...rest}>
            <Icon name={icon} size={size} />
        </button>
    );
};
