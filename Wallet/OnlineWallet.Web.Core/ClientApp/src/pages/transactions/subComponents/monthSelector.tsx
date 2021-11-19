import * as React from "react";
import { renderRange } from "../../../react-ext";
import { Link } from "react-router-dom";

interface MonthSelectorProps {
    year: number;
    month: number;
}

const MonthSelector: React.SFC<MonthSelectorProps> = ({ year, month }) => {
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

const pastMonthClass = "btn btn-light";
const activeMonthClass = "btn btn-primary";
const futureMonthClass = "btn btn-secondary";

function getMonthColoring(year: number, month: number, currentYear: number, currentMonth: number, renderedMonth: number) {
    if (renderedMonth === month) {
        return activeMonthClass;
    }

    if (year > currentYear) {
        return futureMonthClass;
    }
    if (year < currentYear) {
        return pastMonthClass;
    }

    if (renderedMonth <= currentMonth) {
        return pastMonthClass;
    } else {
        return futureMonthClass;
    }

}

export { MonthSelector };
