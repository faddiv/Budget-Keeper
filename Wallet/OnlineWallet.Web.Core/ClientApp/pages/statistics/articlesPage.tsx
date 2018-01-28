import * as React from "react";
import { Layout } from "layout";

export namespace ArticlesPage {
    export interface Props {
    }
    export interface State {
    }
}

export class ArticlesPage extends React.Component<ArticlesPage.Props, ArticlesPage.State> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Layout>
                It works.
            </Layout>
        );
    }
}