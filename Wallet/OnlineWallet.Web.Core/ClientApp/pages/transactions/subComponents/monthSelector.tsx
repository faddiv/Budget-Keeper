import * as React from "react";
import { renderRange } from "react-ext";
import { Link } from "react-router-dom";

interface MonthSelectorProps {
    year: number;
    month: number;
}

const MonthSelector: React.SFC<MonthSelectorProps> = ({ year, month, ...rest }) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    return (

        <div className="btn-group">
            <Link className="btn btn-light" to={`/transactions/${year - 1}/${12}`} >{year - 1}</Link>
            <button className="btn btn-primary" disabled>{year}</button>
            {renderRange(1, 12, i =>
                <Link key={i} className={getMonthColoring(year, month, currentYear, currentMonth, i)} to={`/transactions/${year}/${i}`} >{i}</Link>
            )}
            <Link className="btn btn-light" to={`/transactions/${year + 1}/${1}`} >{year + 1}</Link>
        </div>
    );
};

function getMonthColoring(year: number, month: number, currentYear: number, currentMonth: number, renderedMonth: number) {
    if (renderedMonth === month) {
        return "btn btn-primary";
    }

    if (year > currentYear) {
        return "btn btn-secondary";
    }
    if (year < currentYear) {
        return "btn btn-light";
    }

    if (renderedMonth <= currentMonth) {
        return "btn btn-light";
    } else {
        return "btn btn-secondary";
    }

}

export { MonthSelector };
