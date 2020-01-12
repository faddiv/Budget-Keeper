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
        </>
    );
};

export { Layout };
