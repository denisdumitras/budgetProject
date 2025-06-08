import { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Button } from 'antd';
import type { Income } from '../../types/income';
import dayjs from 'dayjs';

interface IncomeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialValues?: Income;
  title: string;
}

const IncomeModal: React.FC<IncomeModalProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
  title,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date: initialValues.date ? dayjs(initialValues.date) : undefined,
      });
    } else if (visible) {
      form.resetFields();
      // Set default date to today
      form.setFieldsValue({
        date: dayjs(),
      });
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave({
        ...values,
        date: values.date?.toISOString(),
      });
    });
  };

  return (
    <Modal
      open={visible}
      title={title}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSubmit}>
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="source"
          label="Source"
          rules={[{ required: true, message: 'Please enter an income source' }]}
        >
          <Input placeholder="Where did this income come from?" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please enter an amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value: any) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '') as any}
            placeholder="0.00"
            precision={2}
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="Add any additional details" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IncomeModal;
