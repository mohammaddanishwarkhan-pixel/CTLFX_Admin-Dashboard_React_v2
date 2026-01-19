import { Otp } from '@/types';
import axiosInstance from './axios';

export const getOtps = async (): Promise<Otp[]> => {
  const response = await axiosInstance.get('/auth/otps');
  // Response format: {success, message, data: [otps]}
  return Array.isArray(response?.data) ? response.data : [];
};

export const getOtpsByUserId = async (userId: number): Promise<Otp[]> => {
  const response = await axiosInstance.get(`/auth/otps/user/${userId}`);
  // Response format: {success, message, data: [otps]}
  return Array.isArray(response?.data?.data) ? response.data.data : [];
};

export const getOtpById = async (id: number): Promise<Otp | null> => {
  try {
    const response = await axiosInstance.get(`/auth/otps/${id}`);
    // Response format: {success, message, data: {otp}}
    return response?.data || null;
  } catch (error) {
    return null;
  }
};

export const verifyOtp = async (email: string, code: string): Promise<any> => {
  const response = await axiosInstance.post('/auth/verify-otp', { email, code });
  // Response format: {success, message, data: {token}}
  return response?.data || null;
};

export const resendOtp = async (email: string): Promise<any> => {
  const response = await axiosInstance.post('/auth/resend-otp', { email });
  // Response format: {success, message, data: {message}}
  return response?.data || null;
};
