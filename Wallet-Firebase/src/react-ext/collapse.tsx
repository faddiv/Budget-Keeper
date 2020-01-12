import React from "react";
import { Transition } from "react-transition-group";
import classNames from "classnames";
import { ENTERING, ENTERED, EXITED, EXITING, UNMOUNTED } from "react-transition-group/Transition";

export interface CollapseProps {
    open: boolean;
    id?: string;
    className?: string;
}

export interface CollapseState {
    height: number | null;
}

const collapsing = "collapsing";
const collapse = "collapse";
const statusCss = {
    [UNMOUNTED]: collapse,
    [ENTERING]: collapsing,
    [ENTERED]: classNames(collapse, "show"),
    [EXITING]: collapsing,
    [EXITED]: collapse
};

export class Collapse extends React.Component<CollapseProps, CollapseState> {
    constructor(props: CollapseProps) {
        super(props);
        this.state = {
            height: null
        };
    }
    
    onEntering = (node: HTMLElement) => {
        this.setState({
            height: node.scrollHeight
        });
    }

    onEntered = () => {
        this.setState({
            height: null
        });
    }

    onExit = (node: HTMLElement) => {
        this.setState({
            height: node.scrollHeight
        });
    }

    onExiting = (node: HTMLElement) => {
        const height = node.scrollHeight; // required hack
        this.setState({
            height: height - height
        });
    }

    onExited = () => {
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
                        <div style={{ height: height || 0 }} className={classNames(className, statusCss[status])} id={id}>
                            {children}
                        </div>
                    )
                }
            </Transition>
        );
    }
}
