import React from "react";
import { Icon, IconSize } from "./icon";
import { Button } from 'reactstrap';

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "size"> {
    onClick: (evt: React.MouseEvent) => void;
    icon: string;
    size?: IconSize;
    title?: string;
}

export const IconButton: React.SFC<IconButtonProps> = ({ onClick, icon, size, ...rest }) => {
    return (
        <Button color="link" onClick={onClick} {...rest}>
            <Icon name={icon} size={size} />
        </Button>
    );
};
