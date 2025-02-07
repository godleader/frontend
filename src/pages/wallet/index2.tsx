import React, { useState } from "react";
import {
  Layout,
  Button,
  Space,
  Typography,
} from "antd";
import {
  WalletBalance,
  DepositModal,
  Withdraw,
  TransactionHistory,
} from "../../components/wallet";
import { Content } from "antd/lib/layout/layout";

const { Header } = Layout;

export const WalletPage: React.FC = () => {
  const [depositModalVisible, setDepositModalVisible] = useState(false);

  return (
    <Layout>
      <Header style={{ background: "#fff", padding: "0 24px" }}>
        Wallet
      </Header>
      <Content style={{ padding: "24px" }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <WalletBalance />
          <Space>
            <Button type="primary" onClick={() => setDepositModalVisible(true)}>
              Deposit
            </Button>
            <Withdraw />
          </Space>
          <DepositModal
            open={depositModalVisible}
            onClose={() => setDepositModalVisible(false)}
          />
          <TransactionHistory />
        </Space>
      </Content>
    </Layout>
  );
};