import * as React from 'react';
import { Location as HLocation } from 'history';
import { Link, Route } from 'react-router-dom'

interface MenuItemProps {
    to: string | any,
    activeClassName?: string,
    exact?: boolean,
    strict?: boolean,
    getIsActive?: (match, location) => boolean,
    location?: HLocation,
    linkClassName?: string,
    linkStyles?: any,
    ariaCurrent?: boolean
}

const MenuItem: React.SFC<MenuItemProps> = ({ to, strict, activeClassName, ariaCurrent,
    exact, getIsActive, linkClassName, linkStyles, location, ...rest }) => {
    const path = typeof to === 'object' ? to.pathname : to

    // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
    const escapedPath = path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
    return (
        <Route
            path={escapedPath}
            exact={exact}
            strict={strict}
            location={location}
            children={({ location, match }) => {
                const isActive = !!(getIsActive ? getIsActive(match, location) : match)
                const liClass = ["nav-item"];
                if (isActive) {
                    liClass.push(activeClassName)
                }
                return (
                    <li className={liClass.join(" ")}>
                        <Link
                            to={to}
                            className={linkClassName}
                            style={linkStyles}
                            aria-current={isActive && ariaCurrent}
                            {...rest}
                        />
                    </li>
                );
            }} />);
};

MenuItem.defaultProps = {
    activeClassName: "active",
    linkClassName: "nav-link"
};

export { MenuItem };