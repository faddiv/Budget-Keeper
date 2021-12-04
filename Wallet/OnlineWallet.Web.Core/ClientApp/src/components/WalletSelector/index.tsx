import { ForwardedRef, forwardRef, useEffect, useState } from "react";
import { Form, FormSelectProps } from "react-bootstrap";
import { UseFormRegisterReturn } from "react-hook-form";
import { Wallet, walletService } from "../../walletApi";

export interface WalletSelectorProps extends Omit<FormSelectProps, keyof UseFormRegisterReturn>, Omit<UseFormRegisterReturn, "ref"> {}

function WalletSelectorInt(props: WalletSelectorProps, ref: ForwardedRef<HTMLSelectElement>) {
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
