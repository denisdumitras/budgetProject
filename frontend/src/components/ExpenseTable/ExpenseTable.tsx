import { useState } from "react";
import {
  Table,
  Tag,
  Dropdown,
  Button,
  DatePicker,
  Space,
  Typography,
  Input,
} from "antd";
import {
  MoreOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { Expense } from "../../types/expense.ts";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

// Function to get color based on category
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    "Food & Dining": "green",
    Shopping: "blue",
    Groceries: "yellow",
    Housing: "purple",
    Transportation: "orange",
    Entertainment: "magenta",
    Healthcare: "red",
    Personal: "cyan",
    Education: "geekblue",
    Travel: "gold",
    Utilities: "lime",
    Other: "default",
  };

  return colorMap[category] || "default";
};

const { RangePicker } = DatePicker;
const { Text } = Typography;

const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Filter expenses based on date range and search text
  const filteredExpenses = expenses.filter((expense) => {
    // Apply date filter if date range is selected
    if (dateRange && dateRange[0] && dateRange[1]) {
      const expenseDate = dayjs(expense.date).startOf("day");
      const startDate = (dateRange[0] as Dayjs).startOf("day");
      const endDate = (dateRange[1] as Dayjs).startOf("day");

      if (
        !(
          (expenseDate.isAfter(startDate) ||
            expenseDate.isSame(startDate, "day")) &&
          (expenseDate.isBefore(endDate) || expenseDate.isSame(endDate, "day"))
        )
      ) {
        return false;
      }
    }

    // Apply search filter if search text exists
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return (
        expense.description?.toLowerCase().includes(searchLower) ||
        expense.category?.toLowerCase().includes(searchLower) ||
        expense.location?.toLowerCase().includes(searchLower) ||
        expense.amount.toString().includes(searchLower) ||
        dayjs(expense.date)
          .format("MMM D, YYYY")
          .toLowerCase()
          .includes(searchLower) ||
        expense.importance?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Handle date range change
  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    setDateRange(dates);
  };

  // Toggle date filter visibility
  const toggleDateFilter = () => {
    setShowDateFilter(!showDateFilter);
  };

  // Clear date filter
  const clearDateFilter = () => {
    setDateRange(null);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const columns: ColumnsType<Expense> = [
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit",
                onClick: () => onEdit(record),
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => onDelete(record.id),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      render: (date) => dayjs(date).format("MMM D, YYYY"),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [...new Set(expenses.map((expense) => expense.category))].map(
        (category) => ({ text: category, value: category })
      ),
      onFilter: (value, record) => record.category === value,
      render: (category) => (
        <Tag color={getCategoryColor(category)}>{category}</Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Importance",
      dataIndex: "importance",
      key: "importance",
      filters: [
        { text: "High", value: "High" },
        { text: "Medium", value: "Medium" },
        { text: "Low", value: "Low" },
      ],
      onFilter: (value, record) => record.importance === value,
      render: (importance) => {
        const colorMap = {
          High: "red",
          Medium: "orange",
          Low: "blue",
        };
        return (
          <Tag
            color={colorMap[importance as keyof typeof colorMap] || "default"}
          >
            {importance}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Button
            icon={<FilterOutlined />}
            onClick={toggleDateFilter}
            type={
              showDateFilter || (dateRange && dateRange[0] && dateRange[1])
                ? "primary"
                : "default"
            }
          >
            {showDateFilter ? "Hide Date Filter" : "Filter by Date"}
          </Button>
          {dateRange && dateRange[0] && dateRange[1] && (
            <Text style={{ marginLeft: 16 }}>
              Showing {filteredExpenses.length} of {expenses.length} expenses
            </Text>
          )}
          {dateRange && dateRange[0] && dateRange[1] && (
            <Button
              size="small"
              onClick={clearDateFilter}
              style={{ marginLeft: 8 }}
            >
              Clear Date Filter
            </Button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            placeholder="Search expenses..."
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          {searchText && (
            <Text style={{ marginLeft: 16 }}>
              Found {filteredExpenses.length} of {expenses.length} expenses
            </Text>
          )}
        </div>
      </div>

      {showDateFilter && (
        <div
          style={{
            marginBottom: 16,
            padding: 16,
            border: "1px solid #f0f0f0",
            borderRadius: 4,
            background: "#fafafa",
            maxWidth: 400,
          }}
        >
          <Space direction="vertical">
            <Text strong>Select Date Range:</Text>
            <RangePicker
              onChange={handleDateRangeChange}
              value={dateRange}
              allowClear
              format="MMM D, YYYY"
            />
          </Space>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={filteredExpenses.map((expense) => ({
          ...expense,
          key: expense.id,
        }))}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          position: ["bottomRight"],
        }}
        loading={loading}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default ExpenseTable;
