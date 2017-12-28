import * as React from "react";
import { StockModel } from "./StockModel";

interface StockTableProps { stocks: StockModel[]; }

const StockTable: React.SFC<StockTableProps> = ({ stocks, ...rest }) => {
    if (stocks && stocks.length > 0) {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>name</th>
                        <th>category</th>
                        <th>occurence</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((item, index) =>
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.count}</td>
                        </tr>)}
                </tbody>
            </table>
        );
    } else {
        return (
            <div className="jumbotron">
                There is no row to show.
            </div>
        );
    }
};
export { StockTable };
