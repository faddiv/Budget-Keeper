import * as React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { bind } from "bind-decorator";

import { AlertsActions } from "../../services/actions/alerts";
import { transactionService } from "../../services/walletApi";
import { AddItemForm, SaveAllResult } from "./components";
import { toErrorMessage, _ } from "../../services/helpers";
import { TransactionTable } from "../../components/TransactionTable";
import { Prompt } from "react-router";
import { getDirectionColoring, mapTransaction, TransactionViewModel } from "../../services/helpers";

export interface HomeProps {
  actions?: typeof AlertsActions;
}

export interface HomeState {
  items: TransactionViewModel[];
}

class Home2 extends React.Component<HomeProps, HomeState> {
  /**
   *
   */
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.confirmLeave);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.confirmLeave);
  }

  get alertsService() {
    return this.props.actions;
  }

  @bind
  confirmLeave(event: BeforeUnloadEvent) {
    if (this.needLeaveConfirmation()) {
      event.returnValue = leaveConfirmation;
      return leaveConfirmation;
    }
  }

  @bind
  deleteRow(item: TransactionViewModel) {
    this.setState((prevState) => {
      return {
        items: _.remove(prevState.items, item),
      };
    });
  }

  @bind
  updateRow(newItem: TransactionViewModel, original: TransactionViewModel) {
    const items = _.replace(this.state.items, newItem, original);
    this.setState({
      items,
    });
  }

  @bind
  addLine(newItem: TransactionViewModel) {
    this.setState((prevState) => {
      return {
        items: [...prevState.items, newItem],
      };
    });
  }

  @bind
  async saveAll(): Promise<SaveAllResult> {
    try {
      this.alertsService?.dismissAllAlert();
      if (!this.state.items.length) {
        this.alertsService?.showAlert({ type: "warning", message: "Nothing to save" });
        return "fail";
      }
      const serverItems = mapTransaction(this.state.items);
      await transactionService.batchUpdate(serverItems);
      this.alertsService?.showAlert({ type: "success", message: "Transactions are saved successfully." });
      this.setState({
        items: [],
      });
      return "success";
    } catch (error) {
      this.alertsService?.showAlert({ type: "danger", message: toErrorMessage(error) });
      return "fail";
    }
  }

  needLeaveConfirmation() {
    return this.state.items.length > 0;
  }

  render() {
    const { items } = this.state;
    return (
      <>
        <Prompt when={this.needLeaveConfirmation()} message={leaveConfirmation} />
        <AddItemForm addLine={this.addLine} saveAll={this.saveAll} items={items} />
        <TransactionTable items={items} deleted={this.deleteRow} update={this.updateRow} rowColor={getDirectionColoring} />
      </>
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions,
  };
}

const leaveConfirmation = "There are added items. Are you sure leaving?";

export const Home = connect(undefined, mapDispatchToProps)(Home2);
