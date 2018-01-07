import * as React from "react";
import { Transition } from "react-transition-group";
import * as classNames from "classnames";
import { bind } from "helpers";

export namespace Collapse {
    export interface Props {
        open: boolean;
        id?: string;
        className?: string;
    }
    export interface State {
        height: number;
    }
}

const collapsing = "collapsing";
const collapse = "collapse";
const statusCss = {
    entering: collapsing,
    entered: classNames(collapse, "show"),
    exiting: collapsing,
    exited: collapse
};

export class Collapse extends React.Component<Collapse.Props, Collapse.State> {
    constructor(props) {
        super(props);
        this.state = {
            height: null
        };
    }
    @bind
    onEntering(node: HTMLElement) {
        this.setState({
            height: node.scrollHeight
        });
    }

    @bind
    onEntered(node: HTMLElement) {
        this.setState({
            height: null
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
    onExited(node: HTMLElement) {
        this.setState({
            height: null
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
