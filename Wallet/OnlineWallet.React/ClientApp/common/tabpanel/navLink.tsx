import * as React from 'react';

interface NavLinkProps {
    name: string,
    activeKey: string,
    onActivate: (key: string) => void
}

const NavLink: React.SFC<NavLinkProps> = ({ name, activeKey, onActivate, ...rest }) => {
    var className = ["nav-link"];
    const isActive = name === activeKey;
    if (isActive) {
        className.push("active");
    }
    return (
        <li className="nav-item"><a className={className.join(' ')} onClick={() => { !isActive && onActivate(name) }}>{rest.children}</a></li>
    );
};

export { NavLink };