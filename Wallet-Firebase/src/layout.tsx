import React from "react";
import { WalletNavbar } from "./walletCommon";
import { Container } from 'reactstrap';

interface LayoutProps {
}

const Layout: React.SFC<LayoutProps> = ({ ...rest }) => {
    return (
        <>
            <WalletNavbar />
            <Container role="main">
                {rest.children}
            </Container>
            <footer className="text-center text-black-50 font-weight-light">Version: {process.env.REACT_APP_VERSION}</footer>
        </>
    );
};

export { Layout };
