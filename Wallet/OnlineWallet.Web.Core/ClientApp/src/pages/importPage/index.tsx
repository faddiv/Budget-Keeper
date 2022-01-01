import { AlertsActions } from "../../services/actions/alerts";
import { StockTable } from "./components";
import { _, toDateString, toErrorMessage, TransactionViewModel } from "../../services/helpers";
import { transactionService, importExportService, ArticleModel, Transaction } from "../../services/walletApi";
import { Pager, dataFrom, dataTo } from "../../components/MiniComponents/pager";
import { TransactionTable } from "../../components/TransactionTable";
import { useCallback, useMemo, useState } from "react";
import { Row, Stack, Tab, Tabs, Button, Form, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { unstable_batchedUpdates } from "react-dom";
import { TransactionSummaryActions } from "../../services/actions/transactionsSummary";

export function ImportPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string | null>("full");
  const [transactions, setTransactions] = useState<TransactionViewModel[]>([]);
  const [stocks, setStocks] = useState<ArticleModel[]>([]);
  const [pageTransactions, setPageTransactions] = useState(1);
  const [pageStocks, setPageStocks] = useState(1);
  const pageSize = 10;
  const countTransactions = transactions ? transactions.length : 0;
  const countStocks = stocks ? stocks.length : 0;
  const transactionPage = useMemo(
    () => transactions.slice(dataFrom(pageTransactions, pageSize, countTransactions), dataTo(pageTransactions, pageSize, countTransactions)),
    [countTransactions, pageTransactions, transactions]
  );
  const stocksPage = useMemo(() => stocks.slice(dataFrom(pageStocks, pageSize, countStocks), dataTo(pageStocks, pageSize, countStocks)), [
    countStocks,
    pageStocks,
    stocks,
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImportPageForm>({});

  const onSubmit = handleSubmit(async (model) => {
    try {
      const { file } = model;
      dispatch(AlertsActions.dismissAllAlert());
      dispatch(TransactionSummaryActions.transactionsSelected([]));
      setActiveTab("full");
      if (!file || !file.length) {
        dispatch(AlertsActions.showAlert({ type: "danger", message: "Please select a file" }));
        return;
      }
      const response = await importExportService.uploadTransactions(file[0]);
      const transactions = response.map((tr, index) => {
        return {
          category: tr.category,
          comment: tr.comment,
          createdAt: toDateString(tr.created),
          direction: tr.direction,
          key: index,
          name: tr.name,
          price: tr.amount?.toString(10),
          transactionId: tr.matchingId,
          walletId: tr.source === "Cash" ? 1 : 2,
        };
      });
      const stocks = createStockGroups(transactions);
      unstable_batchedUpdates(() => {
        setTransactions(transactions);
        setStocks(stocks);
        setPageTransactions(1);
        setPageStocks(1);
      });
    } catch (error) {
      dispatch(AlertsActions.showAlert({ type: "danger", message: toErrorMessage(error) }));
    }
  });

  const save = useCallback(async () => {
    try {
      dispatch(AlertsActions.dismissAllAlert());
      const serverTransactions = transactions.map((tr) => {
        return {
          category: tr.category,
          comment: tr.comment,
          createdAt: tr.createdAt || "",
          direction: tr.direction,
          name: tr.name,
          transactionId: tr.transactionId,
          value: tr.price ? parseInt(tr.price, 10) : 0,
          walletId: tr.walletId,
        } as Transaction;
      });
      await transactionService.batchUpdate(serverTransactions);
      unstable_batchedUpdates(() => {
        setTransactions([]);
        setStocks([]);
        setActiveTab("full");
      });
    } catch (error) {
      dispatch(AlertsActions.showAlert({ type: "danger", message: toErrorMessage(error) }));
    }
  }, [dispatch, transactions]);

  const transactionUpdated = useCallback((newItem: TransactionViewModel, original: TransactionViewModel) => {
    setTransactions((transactions) => _.replace(transactions, newItem, original));
  }, []);

  const transactionDeleted = useCallback((item: TransactionViewModel) => {
    setTransactions((transactions) => _.remove(transactions, item));
  }, []);

  return (
    <Stack>
      <Row>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="file">
            <Form.Label>File</Form.Label>
            <label htmlFor="file">File</label>
            <Form.Control type="file" {...register("file", { required: true })} isInvalid={!!errors.file} />
            <Form.Control.Feedback type="invalid">File required</Form.Control.Feedback>
          </Form.Group>
          <Row>
            <Col>
              <Button variant="primary" type="submit">
                Upload
              </Button>
              <Button variant="success" type="button" onClick={save}>
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
      <div className="row">
        <div className="col-sm">
          <span>Number of imported row:</span>
          <span>{countTransactions}</span>
        </div>
      </div>
      <Tabs id="import" activeKey={activeTab || "full"} onSelect={setActiveTab}>
        <Tab eventKey="full" title="Full list">
          <TransactionTable items={transactionPage} update={transactionUpdated} deleted={transactionDeleted} rowColor={rowColoring} />
          <Pager page={pageTransactions} pageSize={pageSize} countAll={countTransactions} onPageSelected={setPageTransactions} />
        </Tab>
        <Tab eventKey="groupStock" title="Group stock">
          <StockTable articles={stocksPage} />
          <Pager page={pageStocks} pageSize={pageSize} countAll={countStocks} onPageSelected={setPageStocks} />
        </Tab>
      </Tabs>
    </Stack>
  );
}

interface ImportPageForm {
  file: FileList;
}

function createStockGroups(transactions: TransactionViewModel[]) {
  const stocks = [];
  const grouping: {
    [name: string]: ArticleModel;
  } = {};
  for (const element of transactions) {
    if (grouping[element.name || ""]) {
      grouping[element.name || ""].category = grouping[element.name || ""].category || element.category;
      const occurence = (grouping[element.name || ""].occurence || 0) + 1;
      grouping[element.name || ""].occurence = occurence;
    } else {
      grouping[element.name || ""] = {
        name: element.name || "",
        category: element.category,
        occurence: 1,
      };
    }
  }
  for (const key in grouping) {
    if (grouping.hasOwnProperty(key)) {
      stocks.push(grouping[key]);
    }
  }
  stocks.sort((left, right) => (right.occurence || 0) - (left.occurence || 0));
  return stocks;
}

function rowColoring(item: TransactionViewModel): string {
  if (item.transactionId) {
    return "table-info";
  }
  return "";
}
