import * as React from "react";
import { BalanceInfo } from "../../../services/walletApi";

interface BalanceProps {
  balance?: BalanceInfo;
}

export function Balance({ balance }: BalanceProps) {
  if (!balance) {
    return null;
  }
  return (
    <article className="row">
      <div className="col-sm">
        <span>Income:</span>
        <strong>{balance.income}</strong>
      </div>
      <div className="col-sm">
        <span>Spent:</span>
        <strong>{balance.spent}</strong>
      </div>
      <div className="col-sm">
        <span>Saving:</span>
        <strong>{balance.toSaving}</strong>
      </div>
      <div className="col-sm">
        <span>Planned:</span>
        <strong>{balance.planned}</strong>
      </div>
      <div className="w-100"></div>
      <div className="col-sm">
        <span>Unused:</span>
        <strong>{balance.unused}</strong>
      </div>
    </article>
  );
}
