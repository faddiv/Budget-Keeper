import { forwardRef, useEffect, useState } from "react";
import { Form, FormSelectProps } from "react-bootstrap";
import { UseFormRegisterReturn } from "react-hook-form";
import { Wallet, walletService } from "../../walletApi";

export interface WalletSelectorProps extends Omit<FormSelectProps, keyof UseFormRegisterReturn>, Omit<UseFormRegisterReturn, "ref"> {}

export const WalletSelector = forwardRef<HTMLSelectElement, WalletSelectorProps>((props, ref) => {
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
});
