import { useState, useEffect } from "react";
import { Button, Layout, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import IncomeTable from "../../components/IncomeTable/IncomeTable";
import IncomeModal from "../../components/IncomeModal/IncomeModal";
import type { Income } from "../../types/income";
import IncomeService from "../../services/income.service";
import { useSidebar } from "../../context/SidebarContext";
import "./IncomePage.css";

const { Content } = Layout;
const { Title } = Typography;

const IncomePage: React.FC = () => {
  const { collapsed } = useSidebar();
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIncome, setCurrentIncome] = useState<Income | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  // Fetch income records when component mounts
  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const response = await IncomeService.getAllIncome();
      setIncomeList(response.items);
    } catch (error) {
      message.error("Failed to fetch income records");
      console.error("Error fetching income:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = () => {
    setCurrentIncome(undefined);
    setModalVisible(true);
  };

  const handleEditIncome = (income: Income) => {
    setCurrentIncome(income);
    setModalVisible(true);
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      setLoading(true);
      await IncomeService.deleteIncome(id);

      // Optimistically update the UI first for better responsiveness
      setIncomeList((prevIncomeList) =>
        prevIncomeList.filter((income) => income.id !== id)
      );

      // Then fetch the latest data from the server to ensure consistency
      await fetchIncome();
      message.success("Income record deleted successfully");
    } catch (error) {
      message.error("Failed to delete income record");
      console.error("Error deleting income:", error);
      // Refresh the data in case of error to ensure UI is in sync with server
      await fetchIncome();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIncome = async (
    incomeData: Omit<Income, "id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);

    try {
      if (currentIncome) {
        // Update existing income record
        await IncomeService.updateIncome(currentIncome.id, incomeData);
        message.success("Income record updated successfully");
      } else {
        // Add new income record
        await IncomeService.createIncome(incomeData);
        message.success("Income record added successfully");
      }

      // Refresh the income list
      await fetchIncome();
      setModalVisible(false);
    } catch (error) {
      message.error(
        currentIncome
          ? "Failed to update income record"
          : "Failed to create income record"
      );
      console.error("Error saving income:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className={`income-page ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Content className="income-content">
        <div className="income-header">
          <Title level={2}>Income</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddIncome}
          >
            Add Income
          </Button>
        </div>

        <IncomeTable
          incomeList={incomeList}
          onEdit={handleEditIncome}
          onDelete={handleDeleteIncome}
          loading={loading}
        />

        <IncomeModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={handleSaveIncome}
          initialValues={currentIncome}
          title={currentIncome ? "Edit Income" : "Add Income"}
        />
      </Content>
    </Layout>
  );
};

export default IncomePage;
