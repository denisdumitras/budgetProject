import api from "./api";
import type { Expense } from "../types/expense";

// Type for creating a new expense (omitting server-generated fields)
export type CreateExpenseDto = Omit<Expense, "id" | "createdAt" | "updatedAt">;

// Type for updating an existing expense
export type UpdateExpenseDto = Partial<CreateExpenseDto>;

const ExpensesService = {
  /**
   * Get all expenses
   */
  getAllExpenses: () => {
    return api.get<{ items: Expense[]; count: number }>("/expenses");
  },

  /**
   * Get a single expense by ID
   */
  getExpenseById: (id: string) => {
    return api.get<Expense>(`/expenses/${id}`);
  },

  /**
   * Create a new expense
   */
  createExpense: (expense: CreateExpenseDto) => {
    return api.post<Expense>("/expenses", expense);
  },

  /**
   * Update an existing expense
   */
  updateExpense: (id: string, expense: UpdateExpenseDto) => {
    return api.patch<Expense>(`/expenses/${id}`, expense);
  },

  /**
   * Delete an expense
   */
  deleteExpense: (id: string) => {
    return api.delete<void>(`/expenses/${id}`);
  },

  /**
   * Get expenses filtered by date range
   */
  getExpensesByDateRange: (dateRange: { startDate: string; endDate: string }) => {
    console.log('Fetching expenses with date range:', dateRange);
    return api.get<Expense[]>(`/expenses/date-range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
  },
};

export default ExpensesService;
