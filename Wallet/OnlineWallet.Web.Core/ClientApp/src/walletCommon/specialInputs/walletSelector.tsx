import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { PropsBase } from "../../react-ext";
import { Wallet, walletService } from "../../walletApi";

interface WalletSelectorProps extends PropsBase {
  walletId: number;
  className?: string;
  name?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export function WalletSelector({ walletId, className, name = "walletId", onChange = () => {} }: WalletSelectorProps) {
  const [wallets, setWallets] = useState<Wallet[]>(walletService.cache || []);
  useEffect(() => {
    (async () => {
      const result = await walletService.getAll();
      setWallets(result);
    })();
  }, []);
  return (
    <Form.Select name={name} id={name} onChange={onChange} value={walletId} className={className}>
      {wallets.map((wallet) => (
        <option key={wallet.moneyWalletId} value={wallet.moneyWalletId}>
          {wallet.name}
        </option>
      ))}
    </Form.Select>
  );
}
