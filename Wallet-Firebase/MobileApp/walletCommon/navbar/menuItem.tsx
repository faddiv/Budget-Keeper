import * as React from "react";
import { Location as HLocation } from "history";
import { Link, Route } from "react-router-dom";
import * as classNames from "classnames";

interface MenuItemProps {
    to: string | any;
    activeClassName?: string;
    exact?: boolean;
    strict?: boolean;
    getIsActive?: (match, location) => boolean;
    location?: HLocation;
    linkClassName?: string;
    linkStyles?: any;
    ariaCurrent?: boolean;
}

export const MenuItem: React.SFC<MenuItemProps> = ({ to, strict, activeClassName, ariaCurrent,
    exact, getIsActive, linkClassName, linkStyles, location, ...rest }) => {
    const path = typeof to === "object" ? to.pathname : to;

    // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
    const escapedPath = path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    return (
        <Route
            path={escapedPath}
            exact={exact}
            strict={strict}
            location={location}
            // tslint:disable-next-line:no-shadowed-variable
            children={({ location, match }) => {
                const isActive = !!(getIsActive ? getIsActive(match, location) : match);
                return (
                    <li className={classNames("nav-item", { [activeClassName]: isActive })}>
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
