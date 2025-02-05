import React, { useState } from 'react';
import { Modal, Form, Input, Button, FormInstance } from 'antd';

interface CreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: { name: string; description: string }) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  
  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      onCreate(values as { name: string; description: string });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="创建社工库"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="社工库名称" rules={[{ required: true, message: '请输入社工库名称' }]}>
          <Input placeholder="请输入社工库名称" />
        </Form.Item>
        <Form.Item name="description" label="社工库描述" rules={[{ required: true, message: '请输入社工库描述' }]}>
          <Input.TextArea placeholder="请输入社工库描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModal;

