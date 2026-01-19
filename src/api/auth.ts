import { AuthResponse, LoginCredentials } from '@/types';
import axiosInstance from './axios';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', credentials);

  console.log('Full response:', response);
  console.log('response.data:', response.data);
  console.log('response.data.data:', response.data?.data);

  // Response format: {success, message, data: {token, user}}
  // The actual data is in response.data.data because axios returns response.data
  const token = response.data?.data?.token;
  const user = response.data?.data?.user;

  console.log('Extracted token:', token);
  console.log('Extracted user:', user);

  if (!token || !user) {
    throw new Error('Invalid response from server - missing token or user data');
  }

  return {
    token,
    user
  };
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await axiosInstance.get('/auth/verify');
    return true;
  } catch (error) {
    return false;
  }
};
