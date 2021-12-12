import * as React from "react";
import { Col, Row } from "react-bootstrap";
import { BalanceInfo } from "../../../services/walletApi";

interface BalanceProps {
  balance?: BalanceInfo;
}

export function Balance({ balance }: BalanceProps) {
  if (!balance) {
    return null;
  }
  return (
    <Row className="mb-3">
      <Col>
        <span>Income:</span>
        <strong>{balance.income}</strong>
      </Col>
      <Col>
        <span>Spent:</span>
        <strong>{balance.spent}</strong>
      </Col>
      <Col>
        <span>Saving:</span>
        <strong>{balance.toSaving}</strong>
      </Col>
      <Col>
        <span>Planned:</span>
        <strong>{balance.planned}</strong>
      </Col>
      <Col>
        <span>Unused:</span>
        <strong>{balance.unused}</strong>
      </Col>
    </Row>
  );
}
