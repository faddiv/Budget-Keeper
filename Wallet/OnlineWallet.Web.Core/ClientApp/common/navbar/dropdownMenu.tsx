import * as React from 'react';
import { className, bind } from 'walletCommon';
import { NavLink, withRouter, RouteComponentProps, NavLinkProps, matchPath } from 'react-router-dom';

export namespace DropdownMenu {
    export interface Props extends Partial<RouteComponentProps<Props>> {
        name: string;
    }
    export interface State {
        open: boolean;
        id: string;
        active: boolean;
    }
}

@withRouter
export class DropdownMenu extends React.Component<DropdownMenu.Props, DropdownMenu.State> {
    determineActive(): boolean {
        var props = this.props;
        if (!props.children) return false;
        var children = props.children as Array<React.ReactChild>;
        if (children.length > 0) {
            for (let index = 0; index < children.length; index++) {
                const element = children[index] as React.ReactElement<NavLinkProps>;
                if(element.type as any === NavLink) {
                    if(matchPath(props.location.pathname, {
                        path: element.props.to as string,
                        exact: element.props.exact,
                        strict: element.props.strict
                    })) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            id: Math.round(Math.random()*10000).toString(),
            active: this.determineActive()
        };
    }

    componentDidMount() {
        window.addEventListener("click", this.globalClick, true);
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.globalClick, true);
    }

    @bind
    private globalClick(event: MouseEvent) {
        if (this.state.open && (event.target as HTMLElement).id !== this.state.id) {
            this.setState({
                open: false
            });
        }
    }

    @bind
    openDropdown(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        this.setState((prevState, props) => {
            return {
                open: !prevState.open
            };
        });
    }

    render() {
        const { children, name } = this.props;
        const { open, id, active } = this.state;
        return (
            <li className={className("nav-item", "dropdown", open, "show", active, "active")}>
                <a className="nav-link dropdown-toggle" href="#" id={id} role="button" aria-haspopup="true" aria-expanded={open} onClick={this.openDropdown}>
                    {name}
                </a>
                <div className={className("dropdown-menu", open, "show")} aria-labelledby={id}>
                    {children}
                </div>
            </li>
        );
    }
}