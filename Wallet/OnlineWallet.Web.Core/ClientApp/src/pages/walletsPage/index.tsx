import { Stack } from "react-bootstrap";
import { WalletForm } from "./components/WalletForm";
import { WalletTable } from "./components/WalletTable";

export function WalletPage() {
  return (
    <Stack>
      <WalletForm />
      <WalletTable />
    </Stack>
  );
}
