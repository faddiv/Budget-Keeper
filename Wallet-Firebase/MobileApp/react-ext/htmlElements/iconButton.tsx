import * as React from "react";
import { Icon, IconSize } from "./icon";

interface IconButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onClick" | "size"> {
    onClick: (evt: React.MouseEvent) => void;
    icon: string;
    size?: IconSize;
}

export const IconButton: React.SFC<IconButtonProps> = ({ onClick, icon, size, ...rest }) => {
    return (
        <button className="btn btn-link" onClick={onClick} {...rest}>
            <Icon name={icon} size={size} />
        </button>
    );
};
