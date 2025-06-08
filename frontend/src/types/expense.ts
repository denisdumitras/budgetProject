export interface Expense {
  id: string;
  date: string;
  location: string;
  amount: number;
  category: string;
  description?: string;
  importance: "Low" | "Medium" | "High";
  createdAt: string;
  updatedAt: string;
}
