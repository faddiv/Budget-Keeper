import { bind } from "bind-decorator";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { TransactionViewModel, TransactionTable, getDirectionColoring } from "../../../walletCommon";
import { Card, Collapse } from "react-bootstrap";
import { AlertsActions } from "../../../actions/alerts";
import { Component } from "react";
import { toErrorMessage } from "../../../helpers";

export interface DetailsTableProps {
  parentRow: any;
  colSpan: number;
  queryDetails: (parentRow: any, take: number, skip: number) => Promise<TransactionViewModel[]>;
  toggleDetails: (parentRow: any, open: boolean) => void;
  open: boolean;
  actions?: typeof AlertsActions;
}

export interface DetailsTableState {
  openedArticleTransactions: TransactionViewModel[];
  page: number;
  pageSize: number;
  open: boolean;
}

class DetailsTable2 extends Component<DetailsTableProps, DetailsTableState> {
  constructor(props: DetailsTableProps) {
    super(props);
    this.state = {
      openedArticleTransactions: [],
      page: 1,
      pageSize: 10,
      open: props.open,
    };
  }

  async componentWillReceiveProps?(nextProps: Readonly<DetailsTableProps>) {
    if (this.props.open !== nextProps.open) {
      if (nextProps.open) {
        this.setPage(1, nextProps.parentRow);
      } else {
        this.setState({
          openedArticleTransactions: [],
          page: 1,
          open: false,
        });
      }
    }
  }

  @bind
  toggleDetails() {
    this.props.toggleDetails(this.props.parentRow, !this.props.open);
  }

  @bind
  async firstPage() {
    await this.setPage(1, this.props.parentRow);
  }

  @bind
  async prevPage() {
    if (this.state.page > 1) {
      await this.setPage(this.state.page - 1, this.props.parentRow);
    }
  }

  @bind
  async nextPage() {
    await this.setPage(this.state.page + 1, this.props.parentRow);
  }

  async setPage(page: number, parentRow: any) {
    try {
      const openedArticleTransactions = await this.props.queryDetails(parentRow, this.state.pageSize, (page - 1) * this.state.pageSize);
      this.setState({
        openedArticleTransactions,
        page,
        open: true,
      });
    } catch (error) {
      this.props.actions?.showAlert({
        type: "danger",
        message: toErrorMessage(error),
      });
      this.props.toggleDetails(this.props.parentRow, false);
      return Promise.resolve([]);
    }
  }

  render() {
    const { colSpan } = this.props;
    const { openedArticleTransactions, open } = this.state;
    return (
      <tr>
        <td colSpan={colSpan} style={{ padding: open ? undefined : "0" }}>
          <Collapse in={open}>
            <Card>
              <Card.Body>
                <TransactionTable items={openedArticleTransactions} rowColor={getDirectionColoring} />
              </Card.Body>
              <Card.Footer>
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <button className="page-link" type="button" onClick={this.firstPage}>
                      First
                    </button>
                  </li>
                  <li className="page-item">
                    <button className="page-link" type="button" onClick={this.prevPage}>
                      Previous
                    </button>
                  </li>
                  <li className="page-item">
                    <button className="page-link" type="button" onClick={this.nextPage}>
                      Next
                    </button>
                  </li>
                </ul>
              </Card.Footer>
            </Card>
          </Collapse>
        </td>
      </tr>
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(AlertsActions as any, dispatch) as typeof AlertsActions,
  };
}

export const DetailsTable = connect(undefined, mapDispatchToProps)(DetailsTable2);
