import axiosInstance from './axios';

// Account/Balance APIs
export const getBalance = async (): Promise<any> => {
  const response = await axiosInstance.get('/account/balance');
  // Response format: {success, message, data: {balance, ...}}
  return response?.data || { balance: 0 };
};

export const getSummary = async (): Promise<any> => {
  const response = await axiosInstance.get('/account/summary');
  // Response format: {success, message, data: {summary}}
  return response?.data || {};
};

export const getTransactions = async (params?: any): Promise<any> => {
  const response = await axiosInstance.get('/account/transactions', { params });
  // Response format: {success, message, data: {transactions: [], total, ...}}
  // OR {success, message, data: [transactions]}
  if (response?.data?.transactions) {
    return {
      transactions: Array.isArray(response.data.transactions) ? response.data.transactions : [],
      total: response.data.total || 0,
      limit: response.data.limit || 50,
      offset: response.data.offset || 0
    };
  }
  return {
    transactions: Array.isArray(response?.data) ? response.data : [],
    total: 0,
    limit: 50,
    offset: 0
  };
};
