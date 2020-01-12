import React from "react";
import { Navbar } from "./walletCommon";

interface LayoutProps {
}

const Layout: React.SFC<LayoutProps> = ({ ...rest }) => {
    return (
        <>
            <Navbar />
            <main role="main" className="container">
                {rest.children}
            </main>
        </>
    );
};

export { Layout };
