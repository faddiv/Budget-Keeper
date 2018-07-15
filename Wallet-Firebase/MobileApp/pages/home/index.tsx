import * as React from "react";

export interface HomeProps {
}

export interface HomeState {
}

export class Home extends React.Component<HomeProps, HomeState> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <h1>Hello world!</h1>
        );
    }
}
