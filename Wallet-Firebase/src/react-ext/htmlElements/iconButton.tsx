import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SizeProp, IconProp } from "@fortawesome/fontawesome-svg-core";
import { Button } from 'reactstrap';

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "size"> {
    onClick: (evt: React.MouseEvent) => void;
    icon: IconProp;
    size?: SizeProp;
    title?: string;
}

export const IconButton: React.SFC<IconButtonProps> = ({ onClick, icon, size, ...rest }) => {
    return (
        <Button color="link" onClick={onClick} {...rest}>
            <FontAwesomeIcon icon={icon} size={size} />
        </Button>
    );
};
