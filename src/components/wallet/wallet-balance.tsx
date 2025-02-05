import React, { useContext } from "react";
import { Card, Typography } from "antd";
import { WalletContext } from "../../contexts/wallet-context";

const { Title } = Typography;

export const WalletBalance: React.FC = () => {
  const { balance } = useContext(WalletContext);

  return (
    <Card>
      <Title level={4}>Current Balance</Title>
      <Typography.Text strong style={{ fontSize: "24px" }}>
        ${balance}
      </Typography.Text>
    </Card>
  );
};