import * as React from "react";
import { Link } from "react-router-dom";

interface YearSelectorProps {
    year: number;
    link: string;
}

export const YearSelector: React.SFC<YearSelectorProps> = ({ year, link, ...rest }) => {
    return (
        <nav>
            <ul className="pagination pagination-lg justify-content-center">
                <li className="page-item">
                    <Link className="page-link" to={`${link}/${year - 1}`} >{year - 1}</Link>
                </li>
                <li className="page-item">
                    <span className="page-link">Statistics for {year}</span>
                </li>
                <li className="page-item">
                    <Link className="page-link" to={`${link}/${year + 1}`} >{year + 1}</Link>
                </li>
            </ul>
        </nav>
    );
};

YearSelector.defaultProps = {};