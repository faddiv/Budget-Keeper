import * as React from "react";
import { Wallet } from "../../walletApi";
import { EditDelete, SaveCancel } from "../../walletCommon";
import { updateState } from "../../react-ext";

export interface WalletsRowProps {
  wallet: Wallet;
  save: (newWallet: Wallet, original: Wallet) => void;
  delete_: (wallet: Wallet) => void;
}

export interface WalletsRowState {
  editMode: boolean;
  wallet: Wallet;
}

export class WalletsRow extends React.Component<WalletsRowProps, WalletsRowState> {
  constructor(props: WalletsRowProps) {
    super(props);
    this.state = {
      editMode: false,
      wallet: this.props.wallet,
    };
    this.editWallet = this.editWallet.bind(this);
    this.deleteWallet = this.deleteWallet.bind(this);
    this.saveWallet = this.saveWallet.bind(this);
    this.cancelWallet = this.cancelWallet.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillReceiveProps(nextProps: Readonly<WalletsRowProps>) {
    this.setState({
      wallet: nextProps.wallet,
    });
  }

  deleteWallet() {
    this.props.delete_(this.props.wallet);
  }

  editWallet() {
    this.setState({
      editMode: true,
    });
  }

  saveWallet() {
    this.setState(
      {
        editMode: false,
      },
      () => {
        this.props.save(this.state.wallet, this.props.wallet);
      }
    );
  }

  cancelWallet() {
    this.setState({
      editMode: false,
      wallet: this.props.wallet,
    });
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const wallet = updateState(event);
    this.setState((prevState) => {
      return {
        wallet: { ...prevState.wallet, ...wallet },
      };
    });
  }

  render() {
    return this.state.editMode ? this.renderEdit() : this.renderView();
  }

  renderView() {
    const { wallet } = this.state;
    return (
      <tr>
        <td>{wallet.moneyWalletId}</td>
        <td>{wallet.name}</td>
        <td>
          <EditDelete edit={this.editWallet} delete_={this.deleteWallet} />
        </td>
      </tr>
    );
  }
  renderEdit() {
    const { wallet } = this.state;
    return (
      <tr>
        <td>{wallet.moneyWalletId}</td>
        <td>
          <input type="text" className="form-control" name="name" value={wallet.name} onChange={this.handleInputChange} />
        </td>
        <td>
          <SaveCancel save={this.saveWallet} cancel={this.cancelWallet} />
        </td>
      </tr>
    );
  }
}
