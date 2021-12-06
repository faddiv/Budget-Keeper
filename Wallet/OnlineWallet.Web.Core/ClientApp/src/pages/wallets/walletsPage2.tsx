import { Col, Form, Row, Stack, Button, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CellProps, Column, useTable } from "react-table";
import { RootState } from "../../services/reducers";
import { WalletsModel } from "../../services/reducers/wallets/walletsReducers";
import { Wallet } from "../../services/walletApi";

export function WalletPage() {
  const wallets = useSelector<RootState, WalletsModel>((root) => root.wallets, shallowEqual);
  //const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<Wallet>({
    defaultValues: {
      moneyWalletId: 0,
      name: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow } = useTable<Wallet>({
    columns,
    data: wallets,
  });
  return (
    <Stack>
      <Form onSubmit={onSubmit} noValidate>
        <Form.Group as={Row} controlId="name">
          <Form.Label column xs="2">
            Name
          </Form.Label>
          <Col>
            <Form.Control {...register("name", { required: true })} />
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary">
              Add
            </Button>
          </Col>
        </Form.Group>
      </Form>
      <Table {...getTableProps()} className="transactions">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render(cell.isEdited ? "Editor" : "Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Stack>
  );
}

const columns: Column<Wallet>[] = [
  {
    Header: "Id",
    accessor: "moneyWalletId",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    id: "cmd",
    Header: "",
    Cell: (cellProps: CellProps<Wallet, "name">) => <div>valami</div>,
  },
];
