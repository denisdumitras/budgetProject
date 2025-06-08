import api from "./api";
import type { Investment } from "../types/investment";

interface InvestmentsResponse {
  items: Investment[];
  count: number;
}

class InvestmentsService {
  async getAllInvestments(): Promise<InvestmentsResponse> {
    return api.get<InvestmentsResponse>("/investments");
  }

  async getInvestment(id: string): Promise<Investment> {
    return api.get<Investment>(`/investments/${id}`);
  }

  async createInvestment(
    investment: Omit<Investment, "id" | "createdAt" | "updatedAt">
  ): Promise<Investment> {
    return api.post<Investment>("/investments", investment);
  }

  async updateInvestment(
    id: string,
    investment: Partial<Omit<Investment, "id" | "createdAt" | "updatedAt">>
  ): Promise<Investment> {
    return api.patch<Investment>(`/investments/${id}`, investment);
  }

  async deleteInvestment(id: string): Promise<void> {
    await api.delete(`/investments/${id}`);
  }

  async getInvestmentsByDateRange(dateRange: { startDate: string; endDate: string }): Promise<Investment[]> {
    console.log('Fetching investments with date range:', dateRange);
    return api.get<Investment[]>(`/investments/date-range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
  }
}

export default new InvestmentsService();
