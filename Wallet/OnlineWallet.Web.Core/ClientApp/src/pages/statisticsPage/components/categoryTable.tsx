import { CategoryStatistics, transactionService } from "../../../services/walletApi";
import { mapTransactionViewModel, TransactionViewModel, formatInt } from "../../../services/helpers";
import { Column } from "react-table";
import { useCallback } from "react";
import { TableWithDetails } from "./TableWithDetails";

export interface CategoryTableProps {
  categories: CategoryStatistics[];
  startDate?: string;
  endDate?: string;
}

export function CategoryTable({ categories, startDate, endDate }: CategoryTableProps) {
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

  return <TableWithDetails columns={columns} data={categories} getRowId={getRowId} queryDetails={queryDetails} className="transactions" />;
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
