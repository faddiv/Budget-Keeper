import * as React from "react";
import { Wallet } from "walletApi";

interface WalletSelectorProps {
    walletId: number;
    wallets: Wallet[];
    className?: string;
    name?: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export const WalletSelector: React.SFC<WalletSelectorProps> = ({ walletId, wallets, className, name, onChange, ...rest }) => {
    return (
        <select className={className} value={walletId} name={name} onChange={onChange}>
            {wallets.map(wallet =>
                <option key={wallet.moneyWalletId} value={wallet.moneyWalletId}>{wallet.name}</option>)}
        </select>
    );
};

WalletSelector.defaultProps = {
    className: "form-control",
    name: "walletId",
    onChange: () => { }
};
