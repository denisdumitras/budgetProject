import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  DatePicker,
  Spin,
  Statistic,
  Empty,
} from "antd";
import {
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FundOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import reportsService, {
  ReportData,
  DateRange,
} from "../../services/reports.service";
import { useSidebar } from "../../context/SidebarContext";
import "./ReportsPage.css";

const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const ReportsPage: React.FC = () => {
  const { collapsed } = useSidebar();
  const [loading, setLoading] = useState<boolean>(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  // Debug effect to log the report data whenever it changes
  useEffect(() => {
    console.log('Report data state:', reportData);
  }, [reportData]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      console.log('Fetching report data with date range:', dateRange);
      const data = await reportsService.getReportData(dateRange);
      console.log('Data received from service:', data);
      
      // Ensure we have valid data before setting state
      if (data) {
        setReportData(data);
      } else {
        console.error('Received null or undefined data from reports service');
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange({
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
      });
    }
  };

  // Calculate summary metrics
  const calculateSummary = () => {
    if (!reportData)
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        totalInvestments: 0,
      };

    // Make sure we're working with arrays
    const incomeArray = Array.isArray(reportData.income)
      ? reportData.income
      : [];
    const expensesArray = Array.isArray(reportData.expenses)
      ? reportData.expenses
      : [];
    const investmentsArray = Array.isArray(reportData.investments)
      ? reportData.investments
      : [];

    const totalIncome = incomeArray.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    const totalExpenses = expensesArray.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    const totalInvestments = investmentsArray.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    // Net Savings = Income - Expenses - Investments
    const netSavings = totalIncome - totalExpenses - totalInvestments;

    return { totalIncome, totalExpenses, netSavings, totalInvestments };
  };

  const summary = calculateSummary();

  return (
    <Layout className={`reports-page ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Content className="reports-content">
        <div className="reports-header">
          <Title level={2}>Financial Reports</Title>
        </div>

        <div className="report-filters">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={8} md={6}>
              <Typography.Text strong>Date Range:</Typography.Text>
            </Col>
            <Col xs={24} sm={16} md={18}>
              <RangePicker
                value={[dayjs(dateRange.startDate), dayjs(dateRange.endDate)]}
                onChange={handleDateRangeChange}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : reportData ? (
          <>
            <div className="summary-cards">
              <Card className="summary-card">
                <Statistic
                  title="Total Income"
                  value={summary.totalIncome}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<DollarOutlined />}
                  suffix="$"
                />
              </Card>
              <Card className="summary-card">
                <Statistic
                  title="Total Expenses"
                  value={summary.totalExpenses}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<DollarOutlined />}
                  suffix="$"
                />
              </Card>
              <Card className="summary-card">
                <Statistic
                  title="Net Savings"
                  value={summary.netSavings}
                  precision={2}
                  valueStyle={{
                    color: summary.netSavings >= 0 ? "#3f8600" : "#cf1322",
                  }}
                  prefix={
                    summary.netSavings >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                  suffix="$"
                />
              </Card>
              <Card className="summary-card">
                <Statistic
                  title="Total Investments"
                  value={summary.totalInvestments}
                  precision={2}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<FundOutlined />}
                  suffix="$"
                />
              </Card>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Empty description="No report data available" />
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ReportsPage;
