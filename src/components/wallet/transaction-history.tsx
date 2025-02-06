import React, { useContext } from "react";
import { Table } from "antd";
import { WalletContext } from "../../contexts/wallet-context";

// Define the Transaction interface directly here as it's no longer imported from types
interface Transaction {
  id: number;
  type: "deposit" | "withdrawal";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed"; // Example statuses, adjust as needed
}

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (text: string) => text.toUpperCase(),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (text: number) => `$${text}`,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

export const TransactionHistory: React.FC = () => {
  const { transactions } = useContext(WalletContext);

  return (
    <Table
      columns={columns}
      dataSource={transactions}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};