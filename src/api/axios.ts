import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ctlfx-admin-pannel.onrender.com/api', // Update this to your backend URL
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    console.log("request interceptor error :", {
      endpoint: config.url,
      method: config.method,
      body: config.data,
      params: config.params,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("response interceptor:", {
      endpoint: response.config.url,
      method: response.config.method,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    // Return the full response so API functions can access response.data
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
