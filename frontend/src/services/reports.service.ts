import api from "./api";
import { Income } from "../types/income";
import { Expense } from "../types/expense";
import { Investment } from "../types/investment";

export interface ReportData {
  income: Income[];
  expenses: Expense[];
  investments: Investment[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

class ReportsService {
  async getReportData(dateRange: DateRange): Promise<ReportData> {
    try {
      console.log("Fetching report data with date range:", dateRange);

      // Use the new date-range endpoints to get pre-filtered data from the backend
      const [incomeResponse, expensesResponse, investmentsResponse] =
        await Promise.all([
          api.get<Income[]>(
            `/income/date-range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
          ),
          api.get<Expense[]>(
            `/expenses/date-range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
          ),
          api.get<Investment[]>(
            `/investments/date-range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
          ),
        ]);

      console.log("API Responses:", {
        income: incomeResponse,
        expenses: expensesResponse,
        investments: investmentsResponse,
      });

      // Extract the data from the responses - the backend already filtered by date range
      const incomeData: Income[] = Array.isArray(incomeResponse)
        ? incomeResponse
        : [];
      const expensesData: Expense[] = Array.isArray(expensesResponse)
        ? expensesResponse
        : [];
      const investmentsData: Investment[] = Array.isArray(investmentsResponse)
        ? investmentsResponse
        : [];

      console.log("Extracted data:", {
        income: incomeData,
        expenses: expensesData,
        investments: investmentsData,
      });

      return {
        income: incomeData,
        expenses: expensesData,
        investments: investmentsData,
      };
    } catch (error) {
      console.error("Error fetching report data:", error);
      return {
        income: [],
        expenses: [],
        investments: [],
      };
    }
  }
}

export default new ReportsService();
