import { useDispatch } from "react-redux";
import { TransactionTable } from "../../../components/TransactionTable";
import { Card, Pagination } from "react-bootstrap";
import { AlertsActions } from "../../../services/actions/alerts";
import { useCallback, useEffect, useState } from "react";
import { getDirectionColoring, TransactionViewModel, toErrorMessage } from "../../../services/helpers";
import { unstable_batchedUpdates } from "react-dom";

export interface DetailsTableProps {
  parentRow: any;
  colSpan: number;
  queryDetails: (parentRow: any, take: number, skip: number) => Promise<TransactionViewModel[]>;
  actions?: typeof AlertsActions;
}

const pageSize = 10;

export function DetailsTable({ parentRow, colSpan, queryDetails, actions }: DetailsTableProps) {
  const dispatch = useDispatch();
  const [openedArticleTransactions, setOpenedArticleTransactions] = useState<TransactionViewModel[]>([]);
  const [page, setPage] = useState(1);
  const loadPage = useCallback(
    async (parentRow: any, page: number) => {
      try {
        const openedArticleTransactions = await queryDetails(parentRow, pageSize, (page - 1) * pageSize);
        unstable_batchedUpdates(() => {
          setOpenedArticleTransactions(openedArticleTransactions);
          setPage(page);
        });
      } catch (error) {
        dispatch(
          AlertsActions.showAlert({
            type: "danger",
            message: toErrorMessage(error),
          })
        );
      }
    },
    [dispatch, queryDetails]
  );

  useEffect(() => {
    loadPage(parentRow, 1);
  }, [loadPage, parentRow]);

  const firstPage = useCallback(() => {
    if (page > 1) {
      loadPage(parentRow, 1);
    }
  }, [loadPage, page, parentRow]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      loadPage(parentRow, page - 1);
    }
  }, [loadPage, page, parentRow]);

  const nextPage = useCallback(() => {
    loadPage(parentRow, page + 1);
  }, [loadPage, page, parentRow]);

  return (
    <tr>
      <td colSpan={colSpan}>
        <Card>
          <Card.Body>
            <TransactionTable items={openedArticleTransactions} rowColor={getDirectionColoring} editEnabled={false} />
          </Card.Body>
          <Card.Footer>
            <Pagination className="justify-content-center">
              <Pagination.Item onClick={firstPage} disabled={page === 1}>
                First
              </Pagination.Item>
              <Pagination.Item onClick={prevPage} disabled={page === 1}>
                Previous
              </Pagination.Item>
              <Pagination.Item onClick={nextPage}>Next</Pagination.Item>
            </Pagination>
          </Card.Footer>
        </Card>
      </td>
    </tr>
  );
}
