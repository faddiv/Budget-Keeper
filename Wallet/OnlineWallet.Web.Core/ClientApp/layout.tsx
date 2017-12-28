import * as React from "react";
import { Navbar, AlertList, TransactionSummary } from "walletCommon";
import { Prompt } from "react-router-dom";

interface LayoutProps {
    leaveConfirmation?: LeaveConfirmationParams;
}

const Layout: React.SFC<LayoutProps> = ({ leaveConfirmation, ...rest }) => {
    return (
        <div>
            {leaveConfirmation && <Prompt when={leaveConfirmation.when} message={leaveConfirmation.message} />}
            <AlertList />
            <Navbar />
            <TransactionSummary />
            <main role="main" className="container">
                {rest.children}
            </main>
        </div>
    );
};

interface LeaveConfirmationParams {
    when: boolean;
    message: string;
}

export { Layout };
