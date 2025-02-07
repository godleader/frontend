// src/pages/WalletPage.jsx
import React, { useState, useEffect } from "react";
import { dataProvider } from "../../restdataprovider";
import { notification } from "antd";
import { Card, Form, InputNumber, Button, List, Typography } from "antd";
import { WalletBalance, Withdraw, TransactionHistory, DepositModal } from "../../components/wallet";

const { Title } = Typography;

export const WalletPage = () => {
  // For demo purposes, we use a fixed userId.
  const userId = 1;
  const notify = notification;

  interface Wallet {
    balance: number;
    TransactionHistory: { type: string; amount: number; createdAt: string }[];
  }

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch wallet details from the backend.
  const fetchWallet = async () => {
    setLoading(true);
    try {
      // Use the data provider’s getOne method with a custom meta option for our endpoint.
      const response = await dataProvider.getOne({
        resource: "wallet",
        id: userId,
        meta: { url: `/wallet/${userId}` },
      });
      setWallet(response.data);
    } catch (error) {
      notify.error({
        message: "Error",
        description: "Error fetching wallet details",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for deposit form submission.
  const onDepositFinish = async (values: any) => {
    try {
      await dataProvider.create({
        resource: "deposit",
        data: values,
        meta: { url: `/wallet/${userId}/deposit` },
      });
      notify.success({
        message: "Success",
        description: "Deposit successful",
      });
      fetchWallet();
    } catch (error) {
      notify.error({
        message: "Error",
        description: "Deposit failed",
      });
    }
  };

  // Handler for withdraw form submission.
  const onWithdrawFinish = async (values: any) => {
    try {
      await dataProvider.create({
        resource: "withdraw",
        data: values,
        meta: { url: `/wallet/${userId}/withdraw` },
      });
      notify.success({
        message: "Success",
        description: "Withdrawal successful",
      });
      fetchWallet();
    } catch (error) {
      notify.error({
        message: "Error",
        description: "Withdrawal failed",
      });
    }
  };

  return (
    <Card loading={loading} title="Wallet">
      {wallet && (
        <>
          <Title level={4}>Balance: ${wallet.balance}</Title>
          <List
            header={<div>Transaction History</div>}
            bordered
            dataSource={wallet.TransactionHistory}
            renderItem={(item) => (
              <List.Item>
                {item.type} - ${item.amount} on{" "}
                {new Date(item.createdAt).toLocaleString()}
              </List.Item>
            )}
            style={{ marginBottom: 20 }}
          />
        </>
      )}

      <Card title="Deposit Funds" style={{ marginBottom: 20 }}>
        <Form layout="inline" onFinish={onDepositFinish}>
          <Form.Item
            name="amount"
            rules={[{ required: true, message: "Enter deposit amount" }]}
          >
            <InputNumber placeholder="Amount" min={1} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Deposit
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Withdraw Funds">
        <Form layout="inline" onFinish={onWithdrawFinish}>
          <Form.Item
            name="amount"
            rules={[{ required: true, message: "Enter withdrawal amount" }]}
          >
            <InputNumber placeholder="Amount" min={1} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Withdraw
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Card>
  );
};


