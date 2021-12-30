import { Fragment } from "react";
import { Table } from "react-bootstrap";
import { Column, useExpanded, useTable } from "react-table";
import { TransactionViewModel } from "../../../services/helpers";
import { useExpandedSingle } from "../../../services/react-table-plugins";
import { DetailsTable } from "./DetailsTable";

export interface TableWithDetailsProps<TModel extends object> {
  columns: Column<TModel>[];
  data: TModel[];
  getRowId: (original: TModel) => string;
  queryDetails: (parentRow: TModel, take: number, skip: number) => Promise<TransactionViewModel[]>;
  className?: string;
}
export function TableWithDetails<TModel extends object>({ columns, data, getRowId, queryDetails, className }: TableWithDetailsProps<TModel>) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } = useTable<TModel>(
    {
      columns,
      data,
      getRowId,
      autoResetExpanded: true,
    },
    useExpanded,
    useExpandedSingle
  );

  return (
    <Table {...getTableProps()} className={className}>
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
              {row.isExpanded && <DetailsTable colSpan={visibleColumns.length} parentRow={row.original} queryDetails={queryDetails} />}
            </Fragment>
          );
        })}
      </tbody>
    </Table>
  );
}
