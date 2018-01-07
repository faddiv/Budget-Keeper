import * as React from "react";
import { CategoryStatistics } from "walletApi";
import { formatInt } from "helpers";

interface CategoryTableProps {
    categories: CategoryStatistics[];
}

export const CategoryTable: React.SFC<CategoryTableProps> = ({ categories, ...rest }) => {
    return (
        <table className="table category-statistics">
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Count</td>
                    <td>Spent</td>
                    <td>Spent percent</td>
                </tr>
            </thead>
            <tbody>
                {categories.map(item => (
                    <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{formatInt(item.count)}</td>
                        <td>{formatInt(item.spent)}</td>
                        <td>{item.spentPercent.toLocaleString("en", { style: "percent", maximumFractionDigits: 2 })}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
