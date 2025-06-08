import axios from 'axios';

const API_URL = 'http://localhost:3000'; // NestJS default port

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expensesApi = {
  getAll: () => apiClient.get('/expenses'),
  getById: (id: string) => apiClient.get(`/expenses/${id}`),
  create: (expense: any) => apiClient.post('/expenses', expense),
  update: (id: string, expense: any) => apiClient.put(`/expenses/${id}`, expense),
  delete: (id: string) => apiClient.delete(`/expenses/${id}`),
  categorize: (id: string) => apiClient.post(`/expenses/${id}/categorize`),
  fetchFromBank: () => apiClient.post('/expenses/fetch-from-bank'),
};