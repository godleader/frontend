import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Button, notification, Spin } from "antd";


interface DepositModal {
  open: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModal> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);


  // Fetch user's balance.  This assumes you have an endpoint like `/api/user/balance`.
  // You *must* replace this with your *actual* user and balance fetching logic.
  useEffect(() => {
    const fetchBalance = async () => {
      setBalanceLoading(true);
      try {
        const response = await fetch("/api/user/balance"); //  Your balance endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch balance");
        }
        const data = await response.json();
        setBalance(data.balance); //  Assumes your API returns { balance: ... }
      } catch (error: any) {
        notification.error({
          message: "Error",
          description: error.message || "Could not fetch balance.",
        });
      } finally {
        setBalanceLoading(false);
      }
    };

    if (open) { // Only fetch the balance when the modal is open
      fetchBalance();
    }
  }, [open]); // Run effect when `open` changes


  const onFinish = useCallback(async (values: { amount: number }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/withdraw", { //  Your withdraw endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: values.amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Withdrawal failed");
      }
      // const data = await response.json(); // Use if your API returns data

      notification.success({
        message: "Withdrawal Successful",
        description: "Your withdrawal request has been processed.",
      });
      form.resetFields();
      onClose();
    } catch (error: any) {
      notification.error({
        message: "Withdrawal Failed",
        description: error.message || "There was an issue processing your withdrawal.",
      });
    } finally {
      setLoading(false);
    }
  }, [form, onClose]); // Add dependencies to useCallback



    return (
        <Modal
            open={open}
            title="Withdraw Funds"
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => form.submit()}
                >
                    Withdraw
                </Button>,
            ]}
        >
            <Spin spinning={balanceLoading}>
            {balance !== null && (
                <p>Current Balance: ${balance.toFixed(2)}</p> // Display the balance
            )}
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                    name="amount"
                    label="Amount"
                    rules={[
                        { required: true, message: "Please input the withdrawal amount!" },
                        { type: "number", min: 0.01, message: "Amount must be greater than 0" },
                        ({ getFieldValue }) => ({ // Add a custom validator for sufficient balance
                            validator(_, value) {
                                if (balance !== null && value > balance) {
                                    return Promise.reject(new Error('Insufficient balance'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input type="number" placeholder="Amount" step="0.01" min={0.01} />
                </Form.Item>
            </Form>
            </Spin>
        </Modal>
    );
};