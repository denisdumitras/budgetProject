import { useState } from "react";
import { Table, Dropdown, Button, DatePicker, Space, Typography, Input } from "antd";
import { MoreOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import type { Income } from "../../types/income";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

interface IncomeTableProps {
  incomeList: Income[];
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const { RangePicker } = DatePicker;
const { Text } = Typography;

const IncomeTable: React.FC<IncomeTableProps> = ({
  incomeList,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  
  // Filter income records based on date range and search text
  const filteredIncome = incomeList
    .filter(income => {
      // Apply date filter if date range is selected
      if (dateRange && dateRange[0] && dateRange[1]) {
        const incomeDate = dayjs(income.date).startOf('day');
        const startDate = (dateRange[0] as Dayjs).startOf('day');
        const endDate = (dateRange[1] as Dayjs).startOf('day');
        
        if (!((incomeDate.isAfter(startDate) || incomeDate.isSame(startDate, 'day')) &&
            (incomeDate.isBefore(endDate) || incomeDate.isSame(endDate, 'day')))) {
          return false;
        }
      }
      
      // Apply search filter if search text exists
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return (
          income.description?.toLowerCase().includes(searchLower) ||
          income.source?.toLowerCase().includes(searchLower) ||
          income.amount.toString().includes(searchLower) ||
          dayjs(income.date).format("MMM D, YYYY").toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
    
  // Handle date range change
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
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
  const columns: ColumnsType<Income> = [
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
      title: "Source",
      dataIndex: "source",
      key: "source",
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    }
  ];

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Button 
            icon={<FilterOutlined />} 
            onClick={toggleDateFilter}
            type={showDateFilter || (dateRange && dateRange[0] && dateRange[1]) ? "primary" : "default"}
          >
            {showDateFilter ? "Hide Date Filter" : "Filter by Date"}
          </Button>
          {dateRange && dateRange[0] && dateRange[1] && (
            <Text style={{ marginLeft: 16 }}>
              Showing {filteredIncome.length} of {incomeList.length} income records
            </Text>
          )}
          {dateRange && dateRange[0] && dateRange[1] && (
            <Button size="small" onClick={clearDateFilter} style={{ marginLeft: 8 }}>
              Clear Date Filter
            </Button>
          )}
        </div>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            placeholder="Search income..."
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          {searchText && (
            <Text style={{ marginLeft: 16 }}>
              Found {filteredIncome.length} of {incomeList.length} income records
            </Text>
          )}
        </div>
      </div>
      
      {showDateFilter && (
        <div style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 4, background: '#fafafa', maxWidth: 400 }}>
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
        dataSource={filteredIncome.map((income) => ({
          ...income,
          key: income.id,
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

export default IncomeTable;
