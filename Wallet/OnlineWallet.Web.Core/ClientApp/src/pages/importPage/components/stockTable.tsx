import * as React from "react";
import { PropsBase } from "../../../services/helpers";
import { ArticleModel } from "../../../services/walletApi";

interface StockTableProps extends PropsBase {
  articles: ArticleModel[];
}

export function StockTable({ articles }: StockTableProps) {
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
          {articles.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.occurence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    return <div className="jumbotron">There is no row to show.</div>;
  }
}
