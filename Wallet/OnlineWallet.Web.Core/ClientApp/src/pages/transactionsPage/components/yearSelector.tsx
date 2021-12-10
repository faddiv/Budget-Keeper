import * as React from "react";
import { renderRange } from "../../../services/helpers";

interface YearSelectorProps {
  year: number;
  from: number;
  to: number;
  onChange: (year: number) => void;
}

export function YearSelector({ year, from, to, onChange }: YearSelectorProps) {
  function yearSelected(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange(parseInt(e.target.value, 10));
  }
  return (
    <select className="form-control" value={year} onChange={yearSelected} name="selectedYear" style={{ maxWidth: "100px" }}>
      {renderRange(from, to, (i) => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </select>
  );
}
