import { Transition } from "react-transition-group";
import classNames from "classnames";
import { bind } from "bind-decorator";
import { Component } from "react";

export interface CollapseProps {
    open: boolean;
    id?: string;
    className?: string;
}

export interface CollapseState {
    height: number | undefined;
}

const collapsing = "collapsing";
const collapse = "collapse";
const statusCss = {
    entering: collapsing,
    entered: classNames(collapse, "show"),
    exiting: collapsing,
    exited: collapse,
    unmounted: collapse
};

export class Collapse extends Component<CollapseProps, CollapseState> {
    constructor(props: CollapseProps) {
        super(props);
        this.state = {
            height: undefined
        };
    }
    @bind
    onEntering(node: HTMLElement) {
        this.setState({
            height: node.scrollHeight
        });
    }

    @bind
    onEntered() {
        this.setState({
            height: undefined
        });
    }

    @bind
    onExit(node: HTMLElement) {
        this.setState({
            height: node.scrollHeight
        });
    }

    @bind
    onExiting(node: HTMLElement) {
        const height = node.scrollHeight; // required hack
        this.setState({
            height: height - height
        });
    }

    @bind
    onExited() {
        this.setState({
            height: undefined
        });
    }

    render() {
        const { children, open, className, id } = this.props;
        const { height } = this.state;
        return (
            <Transition in={open} timeout={350} onEntering={this.onEntering} onEntered={this.onEntered} onExit={this.onExit} onExiting={this.onExiting} onExited={this.onExited}>
                {
                    (status) => (
                        <div style={{ height }} className={classNames(className, statusCss[status])} id={id}>
                            {children}
                        </div>
                    )
                }
            </Transition>
        );
    }
}
