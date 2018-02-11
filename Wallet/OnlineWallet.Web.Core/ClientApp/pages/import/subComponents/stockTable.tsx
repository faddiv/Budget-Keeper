import * as React from "react";
import { ArticleModel } from "walletApi";

interface StockTableProps { articles: ArticleModel[]; }

const StockTable: React.SFC<StockTableProps> = ({ articles }) => {
    if (articles && articles.length > 0) {
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
                    {articles.map((item, index) =>
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>{item.occurence}</td>
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
