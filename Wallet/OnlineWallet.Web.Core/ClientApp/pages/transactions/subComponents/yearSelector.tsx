import * as React from "react";
import { renderRange } from "react-ext";

interface YearSelectorProps {
    year: number;
    from: number;
    to: number;
    onChange: (year: number) => void;
}

const YearSelector: React.SFC<YearSelectorProps> = ({ year, from, to, onChange, ...rest }) => {
    function yearSelected(e: React.ChangeEvent<HTMLSelectElement>) {
        onChange(parseInt(e.target.value, 10));
    }
    return (
        <select className="form-control" value={year} onChange={yearSelected} name="selectedYear" style={{ maxWidth: "100px" }}>
            {renderRange(from, to, i => <option key={i} value={i}>{i}</option>)}
        </select>
    );
};

export { YearSelector };
