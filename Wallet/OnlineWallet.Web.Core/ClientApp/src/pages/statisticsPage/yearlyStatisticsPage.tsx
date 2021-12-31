import { useEffect, useState, useMemo } from "react";
import { Stack, Table } from "react-bootstrap";
import { useParams } from "react-router";
import { formatInt, toErrorMessage } from "../../services/helpers";
import { statisticsService, YearlyStatistics } from "../../services/walletApi";
import { YearSelector } from "./components/yearSelector";
import { AlertsActions } from "../../services/actions/alerts";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { useTable, Column } from "react-table";
import { BalanceInfo } from "../../services/walletApi";

export interface YearlyStatisticsPageParams {
  year?: string;
}

export function YearlyStatisticsPage() {
  const { year } = useParams<YearlyStatisticsPageParams>();
  const year2 = parseInt(year || "0", 10) || new Date().getFullYear();
  const [summary, setSummary] = useState<YearlyStatistics>(empty);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const yearly = await statisticsService.yearly(year2);
        setSummary(yearly);
      } catch (error) {
        setSummary(empty);
        dispatch(AlertsActions.showAlert({ type: "danger", message: toErrorMessage(error) }));
      }
    })();
  }, [dispatch, year2]);
  const { monthly } = summary;
  const columns: Column<BalanceInfo>[] = useMemo(() => {
    return [
      {
        Header: "Month",
        accessor: (item, index) => format(new Date(year2, index, 1), "MMM"),
      },
      {
        Header: "Income",
        accessor: (item) => formatInt(item.income),
      },
      {
        Header: "Spent",
        accessor: (item) => formatInt(item.spent),
      },
      {
        Header: "Savings",
        accessor: (item) => formatInt(item.toSaving),
      },
      {
        Header: "Unused",
        accessor: (item) => formatInt(item.unused),
      },
    ];
  }, [year2]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    data: monthly,
    columns,
  });

  return (
    <Stack>
      <YearSelector year={year2} link="/statistics/yearly" />
      <Table {...getTableProps()} className="yearly-statistics">
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
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
          <tr className="table-info">
            <th scope="row">Summary</th>
            <td>{formatInt(summary.income)}</td>
            <td>{formatInt(summary.spent)}</td>
            <td>{formatInt(summary.toSaving)}</td>
            <td>{formatInt(summary.unused)}</td>
          </tr>
        </tbody>
      </Table>
    </Stack>
  );
}

const empty: YearlyStatistics = {
  income: 0,
  monthly: [],
  planned: 0,
  spent: 0,
  toSaving: 0,
  unused: 0,
};
