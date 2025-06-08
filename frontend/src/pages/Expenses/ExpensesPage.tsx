import { useState, useEffect } from "react";
import { Button, Layout, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ExpenseTable from "../../components/ExpenseTable/ExpenseTable";
import ExpenseModal from "../../components/ExpenseModal/ExpenseModal";
import type { Expense } from "../../types/expense";
import ExpensesService from "../../services/expenses.service";
import { useSidebar } from "../../context/SidebarContext";
import "./ExpensesPage.css";

const { Content } = Layout;
const { Title } = Typography;

const ExpensesPage: React.FC = () => {
  const { collapsed } = useSidebar();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  // Fetch expenses when component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await ExpensesService.getAllExpenses();
      setExpenses(response.items);
    } catch (error) {
      message.error("Failed to fetch expenses");
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    setCurrentExpense(undefined);
    setModalVisible(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setCurrentExpense(expense);
    setModalVisible(true);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setLoading(true);
      await ExpensesService.deleteExpense(id);

      // Optimistically update the UI first for better responsiveness
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );

      // Then fetch the latest data from the server to ensure consistency
      await fetchExpenses();
      message.success("Expense deleted successfully");
    } catch (error) {
      message.error("Failed to delete expense");
      console.error("Error deleting expense:", error);
      // Refresh the data in case of error to ensure UI is in sync with server
      await fetchExpenses();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpense = async (
    expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);

    try {
      if (currentExpense) {
        // Update existing expense
        await ExpensesService.updateExpense(currentExpense.id, expenseData);
        message.success("Expense updated successfully");
      } else {
        // Add new expense
        const expenseToCreate = {
          ...expenseData,
        };
        await ExpensesService.createExpense(expenseToCreate);
        message.success("Expense added successfully");
      }

      // Refresh the expense list
      await fetchExpenses();
      setModalVisible(false);
    } catch (error) {
      message.error(
        currentExpense ? "Failed to update expense" : "Failed to create expense"
      );
      console.error("Error saving expense:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className={`expenses-page ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Content className="expenses-content">
        <div className="expenses-header">
          <Title level={2}>Expenses</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddExpense}
          >
            Add Expense
          </Button>
        </div>

        <ExpenseTable
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          loading={loading}
        />

        <ExpenseModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={handleSaveExpense}
          initialValues={currentExpense}
          title={currentExpense ? "Edit Expense" : "Add Expense"}
        />
      </Content>
    </Layout>
  );
};

export default ExpensesPage;
