import * as React from "react";
import { Navbar, AlertList, TransactionSummary } from "walletCommon";

interface LayoutProps {
}

const Layout: React.SFC<LayoutProps> = ({ ...rest }) => {
    return (
        <div>
            <Navbar />
            <AlertList />
            <main role="main" className="container">
                {rest.children}
            </main>
            <TransactionSummary />
        </div>
    );
};

export { Layout };
