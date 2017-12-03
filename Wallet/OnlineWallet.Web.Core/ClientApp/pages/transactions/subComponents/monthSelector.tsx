import * as React from 'react';
import { renderRange } from 'common/misc';

interface MonthSelectorProps { year: number, month: number, onChange: (month: number) => void }

const MonthSelector: React.SFC<MonthSelectorProps> = ({ year, month, onChange, ...rest }) => {
    let now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1;
    return (
        <div className="input-group-btn">
            {renderRange(1, 12, i =>
                <button key={i}
                    className={getMonthColoring(year, month, currentYear, currentMonth, i)}
                    type="button"
                    onClick={() => onChange(i)}
                    name="selectedMonth">{i}</button>)}

        </div>
    );
};

function getMonthColoring(year: number, month: number, currentYear: number, currentMonth: number, renderedMonth: number) {
    
    if (renderedMonth === month) {
        return "btn btn-primary";
    }

    if (year > currentYear)
        return "btn btn-secondary";
    if (year < currentYear)
        return "btn btn-light";

    if (renderedMonth <= currentMonth) {
        return "btn btn-light";
    } else {
        return "btn btn-secondary";
    }


}
export { MonthSelector };