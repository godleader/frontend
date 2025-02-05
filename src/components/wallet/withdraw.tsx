import React, { useContext, useState } from "react";
import { Button, InputNumber, notification } from "antd";
import { WalletContext } from "../../contexts/wallet-context";

export const Withdraw: React.FC = () => {
  const { withdraw } = useContext(WalletContext);
  const [amount, setAmount] = useState(0);

  const handleWithdraw = async () => {
    try {
      await withdraw(amount);
      notification.success({
        message: "Withdrawal Successful",
        description: "The amount has been withdrawn from your wallet.",
      });
      setAmount(0); // Reset the amount after successful withdrawal
    } catch (error) {
      notification.error({
        message: "Withdrawal Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an issue processing your withdrawal.",
      });
    }
  };

  return (
    <div>
      <InputNumber
        min={1}
        value={amount}
        onChange={(value) => setAmount(value || 0)}
        style={{ marginRight: 16 }}
      />
      <Button type="primary" onClick={handleWithdraw}>
        Withdraw
      </Button>
    </div>
  );
};