import axiosInstance from './axios';

export interface DashboardStats {
  users: {
    active: number;
    deleted: number;
  };
  financials: {
    totalDeposits: number;
    totalWithdrawals: number;
  };
  pending: {
    deposits: number;
    withdrawals: number;
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get('/dashboard/stats');
  // Response format: {success, message, data: { ...stats }}
  return response?.data?.data || {
    users: { active: 0, deleted: 0 },
    financials: { totalDeposits: 0, totalWithdrawals: 0 },
    pending: { deposits: 0, withdrawals: 0 }
  };
};
