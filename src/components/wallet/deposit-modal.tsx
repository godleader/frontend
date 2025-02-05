import React, { useState, useContext } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { WalletContext } from "../../contexts/wallet-context";
import { CardDetails } from "../../types";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  open,
  onClose,
}) => {
  const { deposit } = useContext(WalletContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: CardDetails & { amount: number }) => {
    setLoading(true);
    try {
      await deposit(values.amount, {
        cardNumber: values.cardNumber,
        expiryDate: values.expiryDate,
        cvv: values.cvv,
        name: values.name,
      });
      notification.success({
        message: "Deposit Successful",
        description: "Your wallet has been topped up.",
      });
      form.resetFields();
      onClose();
    } catch (error) {
      notification.error({
        message: "Deposit Failed",
        description: "There was an issue processing your deposit.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Deposit Funds"
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
          Deposit
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please input amount!" }]}
        >
          <Input type="number" placeholder="Amount" />
        </Form.Item>
        <Form.Item
          name="cardNumber"
          label="Card Number"
          rules={[{ required: true, message: "Please input card number!" }]}
        >
          <Input placeholder="Card Number" />
        </Form.Item>
        <Form.Item
          name="expiryDate"
          label="Expiry Date"
          rules={[
            { required: true, message: "Please input expiry date!" },
            // Add validation for MM/YY format
          ]}
        >
          <Input placeholder="MM/YY" />
        </Form.Item>
        <Form.Item
          name="cvv"
          label="CVV"
          rules={[{ required: true, message: "Please input CVV!" }]}
        >
          <Input placeholder="CVV" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name on Card"
          rules={[
            { required: true, message: "Please input name on card!" },
          ]}
        >
          <Input placeholder="Name on Card" />
        </Form.Item>
      </Form>
    </Modal>
  );
};