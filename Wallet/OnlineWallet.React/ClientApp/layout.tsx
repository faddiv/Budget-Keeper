import * as React from 'react';
import { Navbar } from "common/navbar/navbar.component";

interface LayoutProps { }

const Layout: React.SFC<LayoutProps> = ({ ...rest }) => {
    return (
        <div>
            <Navbar />
            <main role="main" className="container">
                {rest.children}
            </main>
        </div>
    );
};

export { Layout };