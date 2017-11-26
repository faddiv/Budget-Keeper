import * as React from 'react';
import { Navbar } from "common/navbar/navbar";
import { Prompt } from 'react-router-dom';
import { AlertList } from 'common/misc';

interface LayoutProps { leaveConfirmation?: LeaveConfirmationParams }

const Layout: React.SFC<LayoutProps> = ({ leaveConfirmation, ...rest }) => {
    return (
        <div>
            {leaveConfirmation && <Prompt when={leaveConfirmation.when} message={leaveConfirmation.message} />}
            <AlertList />
            <Navbar />
            <main role="main" className="container">
                {rest.children}
            </main>
        </div>
    );
};

interface LeaveConfirmationParams {
    when: boolean;
    message: string
}

export { Layout };