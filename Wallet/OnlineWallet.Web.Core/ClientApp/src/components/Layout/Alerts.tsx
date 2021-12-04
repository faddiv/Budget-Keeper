import { useHistory } from "react-router";
import { shallowEqual, useSelector, useDispatch } from "react-redux";

import { AlertsActions } from "../../services/actions/alerts";
import { AlertMessage, AlertsModel } from "../../services/reducers/alerts/alertsModel";
import { RootState } from "../../services/reducers";
import { useEffect } from "react";
import { Alert, Container } from "react-bootstrap";

export function Alerts() {
  const history = useHistory();
  const alerts = useSelector<RootState, AlertsModel>((state) => state.alerts, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    const destroy = history.listen(() => {
      dispatch(AlertsActions.dismissAllAlert());
    });
    return destroy;
  }, [dispatch, history]);
  const dismiss = (item: AlertMessage) => {
    dispatch(AlertsActions.dismissAlert(item));
  };
  return (
    <Container className="alerts">
      {alerts.map((item) => (
        <Alert
          variant={item.type}
          dismissible
          onClose={(a, b) => {
            console.log(item, a, b);
            dismiss(item);
          }}
        >
          {item.message}
        </Alert>
      ))}
    </Container>
  );
}
