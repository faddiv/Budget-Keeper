import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { Form, FormSelectProps } from "react-bootstrap";
import { Wallet, walletService } from "../../services/walletApi";

function WalletSelectorInt(props: FormSelectProps, ref: ForwardedRef<HTMLSelectElement>) {
  const [wallets, setWallets] = useState<Wallet[]>(walletService.cache || []);
  useEffect(() => {
    (async () => {
      const result = await walletService.getAll();
      setWallets(result);
    })();
  }, []);
  return (
    <Form.Select ref={ref} {...props}>
      {wallets.map((wallet) => (
        <option key={wallet.moneyWalletId} value={wallet.moneyWalletId}>
          {wallet.name}
        </option>
      ))}
    </Form.Select>
  );
}

export const WalletSelector = forwardRef(WalletSelectorInt);
