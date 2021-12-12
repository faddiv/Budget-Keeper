import { CategoryStatistics, transactionService } from "../../../services/walletApi";
import { DetailsTable } from "./detailsTable";
import { mapTransactionViewModel, TransactionViewModel, formatInt, noop } from "../../../services/helpers";
import { Table } from "react-bootstrap";
import { Column, useExpanded, useTable } from "react-table";
import { Fragment, useCallback } from "react";
import { useExpandedSingle } from "../../../services/react-table-plugins";

export interface CategoryTableProps {
  categories: CategoryStatistics[];
  startDate?: string;
  endDate?: string;
}

export function CategoryTable({ categories, startDate, endDate }: CategoryTableProps) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable<CategoryStatistics>(
    {
      columns,
      data: categories,
      getRowId,
    },
    useExpanded,
    useExpandedSingle
  );

  const queryDetails = useCallback(
    async (parentRow: CategoryStatistics, take: number, skip: number): Promise<TransactionViewModel[]> => {
      const transactions = await transactionService
        .fetchCategory(parentRow.name, {
          limit: take,
          skip,
          start: startDate,
          end: endDate,
        })
        .then(mapTransactionViewModel);
      return transactions;
    },
    [endDate, startDate]
  );

  return (
    <Table {...getTableProps()} className="transactions">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const { key, ...rowProps } = row.getRowProps();
          return (
            <Fragment key={key}>
              <tr {...rowProps} {...row.getToggleRowExpandedProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
              {row.isExpanded && (
                <DetailsTable colSpan={visibleColumns.length} open={row.isExpanded} parentRow={row.original} queryDetails={queryDetails} toggleDetails={noop} />
              )}
            </Fragment>
          );
        })}
      </tbody>
    </Table>
  );
}

const columns: Column<CategoryStatistics>[] = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Count",
    accessor: "count",
    Cell: ({ value }) => formatInt(value),
  },
  {
    Header: "Spent",
    accessor: "spent",
    Cell: ({ value }) => formatInt(value),
  },
  {
    Header: "Spent percent",
    accessor: "spentPercent",
    Cell: ({ value }) => value.toLocaleString("en", { style: "percent", maximumFractionDigits: 2 }),
  },
];

function getRowId(original: CategoryStatistics) {
  return original.name;
}
