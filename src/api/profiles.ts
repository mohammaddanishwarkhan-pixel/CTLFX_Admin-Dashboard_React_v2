import { Profile } from '@/types';
import axiosInstance from './axios';

export const getProfiles = async (): Promise<Profile[]> => {
  const response = await axiosInstance.get('/profile');
  // Response format: {success, message, data: [profiles]}
  return Array.isArray(response?.data) ? response.data : [];
};

export const getProfileByUserId = async (userId: number): Promise<Profile | null> => {
  try {
    const response = await axiosInstance.get(`/profile/user/${userId}`);
    // Response format: {success, message, data: {profile}}
    return response?.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const getProfileById = async (id: number): Promise<Profile | null> => {
  try {
    const response = await axiosInstance.get(`/profile/user/${id}`);
    // Response format: {success, message, data: {profile}}
    return response?.data?.data || null;
  } catch (error) {
    return null;
  }
};

export const createProfile = async (
  profileData: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Profile> => {
  const response = await axiosInstance.post(`/profile/user/${profileData?.userId}`, profileData);
  // Response format: {success, message, data: {profile}}
  if (!response?.data) {
    throw new Error('Invalid response from server');
  }
  return response.data;
};

export const updateProfile = async (userId: number, profileData: Partial<Profile>): Promise<Profile> => {
  const response = await axiosInstance.put(`/profile/user/${userId}`, profileData);
  // Response format: {success, message, data: {profile}}
  if (!response?.data) {
    throw new Error('Invalid response from server');
  }
  return response.data;
};

export const deleteProfile = async (userId: number): Promise<void> => {
  await axiosInstance.delete(`/profile/user/${userId}`);
};
