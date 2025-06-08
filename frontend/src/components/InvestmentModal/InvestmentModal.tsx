import { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Button } from 'antd';
import type { Investment } from '../../types/investment';
import dayjs from 'dayjs';

interface InvestmentModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialValues?: Investment;
  title: string;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
  title,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date: dayjs(initialValues.date),
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({
        date: dayjs(),
      });
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      
      onSave({
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      });
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={handleSubmit}
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ date: dayjs() }}
      >
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: 'Please enter the investment type' }]}
        >
          <Input placeholder="e.g., Stocks, Bonds, Real Estate" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please enter the amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="0.00"
            precision={2}
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={4} placeholder="Optional description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InvestmentModal;
