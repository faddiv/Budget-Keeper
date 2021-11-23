import { MainMenu, AlertList, TransactionSummary } from "./walletCommon";

interface LayoutProps {
}

const Layout: React.SFC<LayoutProps> = ({ ...rest }) => {
    return (
        <>
            <MainMenu />
            <AlertList />
            <main role="main" className="container">
                {rest.children}
            </main>
            <TransactionSummary />
        </>
    );
};

export { Layout };
