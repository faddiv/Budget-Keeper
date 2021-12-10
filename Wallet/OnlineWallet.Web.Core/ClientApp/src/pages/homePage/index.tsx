import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Prompt } from "react-router";
import { TransactionTable } from "../../components/TransactionTable";
import { AlertsActions } from "../../services/actions/alerts";
import { getDirectionColoring, mapTransaction, toErrorMessage, TransactionViewModel, useBeforeUnload, _ } from "../../services/helpers";
import { transactionService } from "../../services/walletApi";
import { AddItemForm, SaveAllResult } from "./components";

export function HomePage() {
  const [items, setItems] = useState<TransactionViewModel[]>([]);
  const dispatch = useDispatch();
  const needConfirmation = items.length > 0;

  const leaveConfirmationHandler = useCallback(
    (evt: BeforeUnloadEvent) => {
      if (needConfirmation) {
        evt.returnValue = leaveConfirmation;
      }
      return undefined;
    },
    [needConfirmation]
  );
  useBeforeUnload(leaveConfirmationHandler);

  const addLine = useCallback((newItem: TransactionViewModel) => {
    setItems((prev) => [...prev, newItem]);
  }, []);

  const saveAll = useCallback(async (): Promise<SaveAllResult> => {
    try {
      dispatch(AlertsActions.dismissAllAlert());
      if (!items.length) {
        dispatch(AlertsActions.showAlert({ type: "warning", message: "Nothing to save" }));
        return "fail";
      }
      const serverItems = mapTransaction(items);
      await transactionService.batchUpdate(serverItems);
      dispatch(AlertsActions.showAlert({ type: "success", message: "Transactions are saved successfully." }));
      setItems([]);
      return "success";
    } catch (error) {
      dispatch(AlertsActions.showAlert({ type: "danger", message: toErrorMessage(error) }));
      return "fail";
    }
  }, [dispatch, items]);

  const deleteRow = useCallback((item: TransactionViewModel) => {
    setItems((prev) => _.remove(prev, item));
  }, []);

  const updateRow = useCallback((newItem: TransactionViewModel, original: TransactionViewModel) => {
    setItems((prev) => _.replace(prev, newItem, original));
  }, []);

  return (
    <>
      <Prompt when={needConfirmation} message={leaveConfirmation} />
      <AddItemForm addLine={addLine} saveAll={saveAll} items={items} />
      <TransactionTable items={items} deleted={deleteRow} update={updateRow} rowColor={getDirectionColoring} />
    </>
  );
}

const leaveConfirmation = "There are added items. Are you sure leaving?";
