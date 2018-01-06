import * as React from "react";
import { bind } from "helpers";
import * as classNames from "classnames";
import { findDOMNode } from "react-dom";
import { NavLink, withRouter, RouteComponentProps, NavLinkProps, matchPath } from "react-router-dom";

export namespace DropdownMenu {
    export interface Props extends Partial<RouteComponentProps<Props>> {
        name: string;
    }
    export interface State {
        show: boolean;
        id: string;
        active: boolean;
    }
}

@withRouter
export class DropdownMenu extends React.Component<DropdownMenu.Props, DropdownMenu.State> {

    constructor(props) {
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
                    if (matchPath(props.location.pathname, {
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

    @bind
    globalClick(event: MouseEvent) {
        if (this.state.show && !findDOMNode(this).contains(event.target as HTMLElement)) {
            this.setState({
                show: false
            });
        }
    }

    @bind
    openDropdown(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        this.setState((prevState, props) => {
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
