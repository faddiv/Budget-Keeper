import { useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toErrorMessage } from "../../../services/helpers";
import { articleService } from "../../../services/walletApi";
import { AlertsActions } from "../../../services/actions/alerts";

export function SyncButton() {
  const dispatch = useDispatch();
  const [sync, setSync] = useState(false);
  
  const synchronize = useCallback(async () => {
    setSync(true);
    try {
      await articleService.syncFromTransactions();
      setSync(false);
      dispatch(
        AlertsActions.showAlert({
          type: "success",
          message: "Synchronization successful",
        })
      );
    } catch (error) {
      setSync(false);
      dispatch(
        AlertsActions.showAlert({
          type: "danger",
          message: "Synchronization failed: " + toErrorMessage(error),
        })
      );
    }
  }, [dispatch]);

  return (
    <Button variant="danger" type="button" onClick={synchronize} disabled={sync}>
      Synchronize {sync ? <i className="fa fa-spinner fa-spin"></i> : null}
    </Button>
  );
}
