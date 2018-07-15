import * as React from "react";
import { Prompt } from "react-router-dom";

interface LayoutProps {
    leaveConfirmation?: LeaveConfirmationParams;
}

const Layout: React.SFC<LayoutProps> = ({ leaveConfirmation, ...rest }) => {
    return (
        <div>
            {leaveConfirmation && <Prompt when={leaveConfirmation.when} message={leaveConfirmation.message} />}
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
