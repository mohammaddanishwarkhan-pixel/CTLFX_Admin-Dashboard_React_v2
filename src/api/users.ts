import { User } from '@/types';
import axiosInstance from './axios';

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get('/user');
  // Response format: {success, message, data: [users]}
  return Array.isArray(response?.data?.data) ? response.data.data : [];
};

export const getAllUsers = async (params?: any): Promise<{ data: User[]; total: number }> => {
  const response = await axiosInstance.get('/user', { params });
  const data = response?.data?.data;
  if (data && Array.isArray(data.users)) {
    return { data: data.users, total: data.total || 0 };
  }
  return { data: [], total: 0 };
};

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    console.log("user response", response);

    // Response format: {success, message, data: {user}}
    return response?.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const response = await axiosInstance.post('/user', userData);
  // Response format: {success, message, data: {user}}
  if (!response?.data) {
    throw new Error('Invalid response from server');
  }
  return response.data;
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const response = await axiosInstance.put(`/user/${id}`, userData);
  if (!response?.data) {
    throw new Error('Invalid response from server');
  }
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/user/${id}`);
};

export const restoreUser = async (id: number): Promise<User> => {
  // If there's a restore endpoint, use it. Otherwise, update isDeleted flag
  const response = await axiosInstance.put(`/user/${id}`, { isDeleted: false });
  if (!response?.data) {
    throw new Error('Invalid response from server');
  }
  return response.data;
};

export const addPaymentToUser = async (userId: number, paymentData: any): Promise<any> => {
  const response = await axiosInstance.post(`/user/${userId}/payments`, paymentData);
  // Response format: {success, message, data: {payment}}
  return response?.data || null;
};
