import React from "react";
import classNames from "classnames";
import { findDOMNode } from "react-dom";
import { NavLink, withRouter, RouteComponentProps, NavLinkProps, matchPath } from "react-router-dom";

export interface DropdownMenuProps extends Partial<RouteComponentProps<void>> {
    name: string;
}

export interface DropdownMenuState {
    show: boolean;
    id: string;
    active: boolean;
}

class DropdownMenu2 extends React.Component<DropdownMenuProps, DropdownMenuState> {

    constructor(props: DropdownMenuProps) {
        super(props);
        this.state = {
            show: false,
            id: Math.round(Math.random() * 10000).toString(),
            active: this.determineActive()
        };
    }

    determineActive(): boolean {
        const props = this.props;
        if (!props.children) { return false; }
        const children = props.children as React.ReactChild[];
        if (children.length > 0) {
            for (const element of children) {
                const el = element as React.ReactElement<NavLinkProps>;
                if (el.type as any === NavLink) {
                    if (props.location && matchPath(props.location.pathname, {
                        path: el.props.to as string,
                        exact: el.props.exact,
                        strict: el.props.strict
                    })) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    componentDidMount() {
        window.addEventListener("click", this.globalClick, true);
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.globalClick, true);
    }

    
    globalClick = (event: MouseEvent) => {
        if (!this.state.show)
        return;
        const thisNode = findDOMNode(this);
        if (thisNode && !thisNode.contains(event.target as HTMLElement)) {
            this.setState({
                show: false
            });
        }
    }

    
    openDropdown = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        this.setState((prevState) => {
            return {
                show: !prevState.show
            };
        });
    }

    render() {
        const { children, name } = this.props;
        const { show, id, active } = this.state;
        return (
            <li className={classNames("nav-item", "dropdown", { show, active })}>
                <a className="nav-link dropdown-toggle" href="#" id={id} role="button" aria-haspopup="true" aria-expanded={show} onClick={this.openDropdown}>
                    {name}
                </a>
                <div className={classNames("dropdown-menu", { show })} aria-labelledby={id}>
                    {children}
                </div>
            </li>
        );
    }
}

export const DropdownMenu = withRouter(DropdownMenu2 as any) as any as typeof DropdownMenu2;
