import { Payment } from '@/types';
import axiosInstance from './axios';

export const getPayments = async (params?: any): Promise<{ data: Payment[]; total: number }> => {
  const response = await axiosInstance.get('/payments', { params });
  console.log("payments", response);

  // Response format: {success, message, data: {payments: [], total, limit, offset}}
  const data = response?.data?.data;
  if (data && Array.isArray(data.payments)) {
    return { data: data.payments, total: data.total || 0 };
  }
  return { data: [], total: 0 };
};

export const getPaymentsByUserId = async (userId: number, params?: any): Promise<{ data: Payment[]; total: number }> => {
  const response = await axiosInstance.get(`/payments/user/${userId}`, { params });
  // Response format: {success, message, data: {payments: [], total, limit, offset}}
  const data = response?.data?.data;
  if (data && Array.isArray(data.payments)) {
    return { data: data.payments, total: data.total || 0 };
  }
  return { data: [], total: 0 };
};

export const getPaymentById = async (id: number): Promise<Payment | null> => {
  try {
    const response = await axiosInstance.get(`/payments/${id}`);
    // Response format: {success, message, data: {payment}}
    return response?.data || null;
  } catch (error) {
    return null;
  }
};

export const createPayment = async (
  paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Payment> => {
  const response = await axiosInstance.post('/payments', paymentData);
  // Response format: {success, message, data: {payment}}
  if (!response?.data) {
    throw new Error('Invalid response from server');
  }
  return response.data;
};

export const updatePayment = async (id: number, paymentData: Partial<Payment>): Promise<Payment> => {
  const response = await axiosInstance.put(`/payments/${id}`, paymentData);
  if (!response?.data) {
    throw new Error('Invalid response from server');
  }
  return response.data;
};

export const updatePaymentStatus = async (id: number, status: string): Promise<Payment> => {
  const response = await axiosInstance.patch(`/payments/${id}/status`, { status });
  // Response format: {success, message, data: {payment}}
  if (!response?.data) {
    throw new Error('Invalid response from server');
  }
  return response.data;
};

export const deletePayment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/payments/${id}`);
};
