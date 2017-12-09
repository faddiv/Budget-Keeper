import * as React from "react";
import { className } from "react-ext";

interface NavLinkProps {
    name: string;
    activeKey: string;
    onActivate: (key: string) => void;
}

export const NavLink: React.SFC<NavLinkProps> = ({ name, activeKey, onActivate, ...rest }) => {
    const isActive = name === activeKey;
    return (
        <li className="nav-item"><a className={className("nav-link", isActive, "active")} onClick={() => { !isActive && onActivate(name); }}>{rest.children}</a></li>
    );
};
