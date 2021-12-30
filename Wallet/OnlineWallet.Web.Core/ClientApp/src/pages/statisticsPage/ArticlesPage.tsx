import { ChangeEvent, useCallback, useState } from "react";
import { Col, Row, Form, Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Column } from "react-table";
import { AlertsActions } from "../../services/actions/alerts";
import { mapTransactionViewModel, toErrorMessage, TransactionViewModel } from "../../services/helpers";
import { ArticleModel, articleService, transactionService } from "../../services/walletApi";
import { SyncButton } from "./components/SyncButton";
import { TableWithDetails } from "./components/TableWithDetails";

export function ArticlesPage() {
  const dispatch = useDispatch();
  const [articles, setArticles] = useState<ArticleModel[]>([]);

  const handleInputChange = useCallback(
    async (evt: ChangeEvent<HTMLInputElement>) => {
      var name = evt.target.value;
      try {
        const result = name && name.length > 1 ? await articleService.filterBy(name, 30) : emptyArray;
        if (name === evt.target.value) {
          setArticles(result);
        }
      } catch (error) {
        if (name === evt.target.value) {
          setArticles(emptyArray);
        }
        dispatch(AlertsActions.showAlert({ type: "danger", message: toErrorMessage(error) }));
      }
    },
    [dispatch]
  );

  const queryDetails = useCallback(async (parentRow: ArticleModel, take: number, skip: number): Promise<TransactionViewModel[]> => {
    const transactions = await transactionService.fetchArticle(parentRow.name || "", take, skip).then(mapTransactionViewModel);
    return transactions;
  }, []);

  return (
    <Stack>
      <Form>
        <Form.Group as={Row} className="mb-2">
          <Form.Label column xs="auto" htmlFor="name">
            Article
          </Form.Label>
          <Col>
            <Form.Control type="name" id="name" name="name" placeholder="Search article..." onChange={handleInputChange} />
          </Col>
          <Col xs="auto">
            <SyncButton />
          </Col>
        </Form.Group>
      </Form>
      <TableWithDetails columns={columns} data={articles} getRowId={getRowId} queryDetails={queryDetails} />
    </Stack>
  );
}

const emptyArray: any[] = [];

function getRowId(original: ArticleModel) {
  return original.name;
}

const columns: Column<ArticleModel>[] = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Category",
    accessor: "category",
  },
  {
    Header: "Last price",
    accessor: "lastPrice",
  },
  {
    Header: "Last wallet",
    accessor: "lastWallet",
  },
  {
    Header: "Occurence",
    accessor: "occurence",
  },
];
