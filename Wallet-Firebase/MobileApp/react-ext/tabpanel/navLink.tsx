import React from "react";
import classNames from "classnames";

interface NavLinkProps {
    name: string;
    activeKey: string;
    onActivate: (key: string) => void;
}

export const NavLink: React.SFC<NavLinkProps> = ({ name, activeKey, onActivate, ...rest }) => {
    const active = name === activeKey;
    return (
        <li className="nav-item">
            <a className={classNames("nav-link", { active })} onClick={() => { !active && onActivate(name); }}>
                {rest.children}
            </a>
        </li>
    );
};
