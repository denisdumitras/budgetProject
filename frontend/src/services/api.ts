import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:3000';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add a response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Safely access the error message with proper type checking
    const errorData = error.response?.data as Record<string, any> | undefined;
    const errorMessage = errorData?.message || `API Error: ${error.response?.status}`;
    console.error('API request failed:', errorMessage);
    return Promise.reject(error);
  }
);

/**
 * Generic API service using Axios
 */
export default {
  /**
   * GET request
   */
  get: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(endpoint, config);
    return response.data;
  },
  
  /**
   * POST request
   */
  post: async <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(endpoint, data, config);
    return response.data;
  },
  
  /**
   * PUT request
   */
  put: async <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(endpoint, data, config);
    return response.data;
  },
  
  /**
   * PATCH request
   */
  patch: async <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.patch(endpoint, data, config);
    return response.data;
  },
  
  /**
   * DELETE request
   */
  delete: async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(endpoint, config);
    return response.data;
  },
};
