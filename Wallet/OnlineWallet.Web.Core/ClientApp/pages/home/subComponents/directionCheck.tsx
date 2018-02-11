import * as React from "react";
import { MoneyDirection } from "walletApi";

interface DirectionCheckProps {
    value: MoneyDirection;
    onChange?: () => void;
}

const DirectionCheck: React.SFC<DirectionCheckProps> = ({ value, onChange }) => {
    return (
        <div className="form-group">
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input className="form-check-input" type="radio" name="direction" value="-1" checked={value === -1} onChange={onChange} /> Expense</label>
            </div>
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input className="form-check-input" type="radio" name="direction" value="0" checked={value === 0} onChange={onChange} /> Plan</label>
            </div>
            <div className="form-check form-check-inline">
                <label className="form-check-label">
                    <input className="form-check-input" type="radio" name="direction" value="1" checked={value === 1} onChange={onChange} /> Salary</label>
            </div>
        </div>
    );
};

DirectionCheck.defaultProps = {
    onChange: () => {}
};

export { DirectionCheck };
