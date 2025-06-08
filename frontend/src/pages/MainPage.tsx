import React, { useState } from 'react';
import { Button, Modal, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Define Expense type
interface Expense {
  id: string;
  date: string;
  place: string;
  amount: number;
  category: string;
}

// Sample data
const sampleData: Expense[] = [
  {
    id: '1',
    date: '2025-05-20',
    place: 'Grocery Store',
    amount: 45.99,
    category: 'Food'
  },
  {
    id: '2',
    date: '2025-05-18',
    place: 'Gas Station',
    amount: 35.50,
    category: 'Transportation'
  },
  {
    id: '3',
    date: '2025-05-15',
    place: 'Bookstore',
    amount: 22.99,
    category: 'Entertainment'
  }
];

// Category options
const categoryOptions = [
  { value: 'Food', label: 'Food' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Housing', label: 'Housing' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Other', label: 'Other' }
];

// Function to get color for category tag
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Food': 'green',
    'Transportation': 'blue',
    'Entertainment': 'purple',
    'Utilities': 'orange',
    'Housing': 'cyan',
    'Healthcare': 'red',
    'Education': 'magenta',
    'Other': 'default'
  };
  
  return colorMap[category] || 'default';
};

const MainPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(sampleData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Modal handlers
  const showAddModal = () => {
    setEditingExpense(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    form.setFieldsValue({
      ...expense,
      date: dayjs(expense.date)
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Form submission
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        id: editingExpense ? editingExpense.id : Date.now().toString()
      };

      if (editingExpense) {
        setExpenses(prevExpenses => 
          prevExpenses.map(exp => exp.id === editingExpense.id ? formattedValues : exp)
        );
        message.success('Expense updated successfully');
      } else {
        setExpenses(prevExpenses => [...prevExpenses, formattedValues]);
        message.success('Expense added successfully');
      }

      setIsModalOpen(false);
    });
  };

  // Delete expense
  const handleDelete = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(exp => exp.id !== id));
    message.success('Expense deleted successfully');
  };

  // Render form items
  const renderFormItems = () => (
    <Form
      form={form}
      layout="vertical"
      name="expenseForm"
    >
      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <Form.DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="place"
        label="Place"
        rules={[{ required: true, message: 'Please enter the place' }]}
      >
        <Form.Input placeholder="Where did you spend money?" />
      </Form.Item>

      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: 'Please enter the amount' }]}
      >
        <Form.InputNumber
          style={{ width: '100%' }}
          addonBefore="$"
          placeholder="0.00"
          precision={2}
          min={0}
        />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Form.Select
          placeholder="Select a category"
          options={categoryOptions}
        />
      </Form.Item>
    </Form>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Action button */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          Add Expense
        </Button>
      </div>

      {/* Table */}
      <div style={{ flexGrow: 1, overflow: 'auto' }}>
        <Form.Table
          dataSource={expenses}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          columns={[
            {
              title: 'Date',
              dataIndex: 'date',
              key: 'date',
              sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            },
            {
              title: 'Place',
              dataIndex: 'place',
              key: 'place',
            },
            {
              title: 'Amount',
              dataIndex: 'amount',
              key: 'amount',
              render: (amount) => `$${amount.toFixed(2)}`,
              sorter: (a, b) => a.amount - b.amount,
            },
            {
              title: 'Category',
              dataIndex: 'category',
              key: 'category',
              render: (category) => (
                <Form.Tag color={getCategoryColor(category)}>{category}</Form.Tag>
              ),
              filters: categoryOptions.map(option => ({
                text: option.label,
                value: option.value
              })),
              onFilter: (value, record) => record.category === value,
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Form.Dropdown menu={{
                  items: [
                    {
                      key: '1',
                      label: 'Edit',
                      icon: <Form.EditOutlined />,
                      onClick: () => showEditModal(record)
                    },
                    {
                      key: '2',
                      label: 'Delete',
                      icon: <Form.DeleteOutlined />,
                      danger: true,
                      onClick: () => handleDelete(record.id)
                    }
                  ]
                }} trigger={['click']}>
                  <Button type="text" icon={<Form.SettingOutlined />} />
                </Form.Dropdown>
              ),
            },
          ]}
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingExpense ? "Edit Expense" : "Add Expense"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
      >
        {renderFormItems()}
      </Modal>
    </div>
  );
};

export default MainPage;
