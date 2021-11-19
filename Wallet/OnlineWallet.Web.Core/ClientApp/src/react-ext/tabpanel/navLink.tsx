import classNames from "classnames";
import { FunctionComponent } from "react";

interface NavLinkProps {
    name: string;
    activeKey: string;
    onActivate: (key: string) => void;
}

export const NavLink: FunctionComponent<NavLinkProps> = ({ name, activeKey, onActivate, ...rest }) => {
    const active = name === activeKey;
    return (
        <li className="nav-item">
            <a className={classNames("nav-link", { active })} onClick={() => { !active && onActivate(name); }}>
                {rest.children}
            </a>
        </li>
    );
};
