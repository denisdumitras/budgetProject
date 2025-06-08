import { useState, useEffect } from "react";
import { Button, Layout, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import InvestmentTable from "../../components/InvestmentTable/InvestmentTable";
import InvestmentModal from "../../components/InvestmentModal/InvestmentModal";
import type { Investment } from "../../types/investment";
import InvestmentsService from "../../services/investments.service";
import { useSidebar } from "../../context/SidebarContext";
import "./InvestmentsPage.css";

const { Content } = Layout;
const { Title } = Typography;

const InvestmentsPage: React.FC = () => {
  const { collapsed } = useSidebar();
  const [investmentList, setInvestmentList] = useState<Investment[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentInvestment, setCurrentInvestment] = useState<
    Investment | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  // Fetch investment records when component mounts
  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await InvestmentsService.getAllInvestments();
      setInvestmentList(response.items);
    } catch (error) {
      message.error("Failed to fetch investment records");
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvestment = () => {
    setCurrentInvestment(undefined);
    setModalVisible(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setCurrentInvestment(investment);
    setModalVisible(true);
  };

  const handleDeleteInvestment = async (id: string) => {
    try {
      setLoading(true);
      await InvestmentsService.deleteInvestment(id);

      // Optimistically update the UI first for better responsiveness
      setInvestmentList((prevInvestments) =>
        prevInvestments.filter((investment) => investment.id !== id)
      );

      // Then fetch the latest data from the server to ensure consistency
      await fetchInvestments();
      message.success("Investment deleted successfully");
    } catch (error) {
      message.error("Failed to delete investment");
      console.error("Error deleting investment:", error);
      // Refresh the data in case of error to ensure UI is in sync with server
      await fetchInvestments();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInvestment = async (
    investmentData: Omit<Investment, "id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);

    try {
      if (currentInvestment) {
        // Update existing investment
        await InvestmentsService.updateInvestment(
          currentInvestment.id,
          investmentData
        );
        message.success("Investment updated successfully");
      } else {
        // Create new investment
        await InvestmentsService.createInvestment(investmentData);
        message.success("Investment created successfully");
      }

      // Refresh the investment list
      await fetchInvestments();
      setModalVisible(false);
    } catch (error) {
      message.error(
        currentInvestment
          ? "Failed to update investment record"
          : "Failed to create investment record"
      );
      console.error("Error saving investment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      className={`investments-page ${collapsed ? "sidebar-collapsed" : ""}`}
    >
      <Content className="investments-content">
        <div className="investments-header">
          <Title level={2}>Investments</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddInvestment}
          >
            Add Investment
          </Button>
        </div>

        <InvestmentTable
          investmentList={investmentList}
          onEdit={handleEditInvestment}
          onDelete={handleDeleteInvestment}
          loading={loading}
        />

        <InvestmentModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={handleSaveInvestment}
          initialValues={currentInvestment}
          title={currentInvestment ? "Edit Investment" : "Add Investment"}
        />
      </Content>
    </Layout>
  );
};

export default InvestmentsPage;
