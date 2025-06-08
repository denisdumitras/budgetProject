import api from "./api";
import type { Income } from "../types/income";

// Type for creating a new income (omitting server-generated fields)
export type CreateIncomeDto = Omit<Income, "id" | "createdAt" | "updatedAt">;

// Type for updating an existing income
export type UpdateIncomeDto = Partial<CreateIncomeDto>;

const IncomeService = {
  /**
   * Get all income records
   */
  getAllIncome: () => {
    return api.get<{ items: Income[]; count: number }>("/income");
  },

  /**
   * Get a single income record by ID
   */
  getIncomeById: (id: string) => {
    return api.get<Income>(`/income/${id}`);
  },

  /**
   * Create a new income record
   */
  createIncome: (income: CreateIncomeDto) => {
    return api.post<Income>("/income", income);
  },

  /**
   * Update an existing income record
   */
  updateIncome: (id: string, income: UpdateIncomeDto) => {
    return api.patch<Income>(`/income/${id}`, income);
  },

  /**
   * Delete an income record
   */
  deleteIncome: (id: string) => {
    return api.delete<void>(`/income/${id}`);
  },

  /**
   * Get income records filtered by date range
   */
  getIncomeByDateRange: (dateRange: { startDate: string; endDate: string }) => {
    console.log('Fetching income with date range:', dateRange);
    return api.get<Income[]>(`/income/date-range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
  },
};

export default IncomeService;
