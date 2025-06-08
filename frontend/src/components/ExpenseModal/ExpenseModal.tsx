import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Button,
} from "antd";
import type { Expense } from "../../types/expense.ts";
import dayjs from "dayjs";

interface ExpenseModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => void;
  initialValues?: Expense;
  title: string;
}

const { Option } = Select;

const categories = [
  "Food & Dining",
  "Shopping",
  "Groceries",
  "Housing",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Personal",
  "Education",
  "Travel",
  "Utilities",
  "Other",
];

const ExpenseModal: React.FC<ExpenseModalProps> = ({
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
        initialValues={{ importance: "Medium" }}
      >
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: true, message: "Please enter a location" }]}
        >
          <Input placeholder="Where was this expense made?" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: "Please enter an amount" }]}
        >
          <InputNumber<number>
            style={{ width: "100%" }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => {
              if (value === undefined || value === null) return 0;
              return parseFloat(value.replace(/\$\s?|(,*)/g, "")) || 0;
            }}
            placeholder="0.00"
            precision={2}
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select a category">
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Add any additional details" />
        </Form.Item>

        <Form.Item name="importance" label="Importance">
          <Select>
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExpenseModal;
