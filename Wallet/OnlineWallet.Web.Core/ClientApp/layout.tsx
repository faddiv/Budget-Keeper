import * as React from "react";
import { Navbar, AlertList, TransactionSummary } from "walletCommon";

interface LayoutProps {
}

const Layout: React.SFC<LayoutProps> = ({ ...rest }) => {
    return (
        <>
            <Navbar />
            <AlertList />
            <main role="main" className="container">
                {rest.children}
            </main>
            <TransactionSummary />
        </>
    );
};

export { Layout };
