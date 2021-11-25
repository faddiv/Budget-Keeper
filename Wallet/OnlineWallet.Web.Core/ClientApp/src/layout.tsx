import { MainMenu, Alerts, TransactionSummary } from "./walletCommon";

interface LayoutProps {
}

const Layout: React.SFC<LayoutProps> = ({ ...rest }) => {
    return (
        <>
            <MainMenu />
            <Alerts />
            <main role="main" className="container">
                {rest.children}
            </main>
            <TransactionSummary />
        </>
    );
};

export { Layout };
