import React from "react";

export type IconSize = "xs"|"sm"|"lg"|"2x"|"3x"|"5x"|"7x"|"10x";

interface IconProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    name: string;
    size?: IconSize;
}

export const Icon: React.SFC< IconProps> = ({ name, size, ...rest }) => {
    let className = `fa fa-${name}`;
    if (size) {
        className = `${className} fa-${size}`;
    }
    return (
        <span className={className} {...rest} />
    );
};
