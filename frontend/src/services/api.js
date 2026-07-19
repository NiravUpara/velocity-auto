import axios from 'axios';

// Create an Axios instance with the backend base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Request interceptor: automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 && 
      !window.location.pathname.startsWith('/login') && 
      window.location.pathname !== '/register' && 
      window.location.pathname !== '/'
    ) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = (username, password) =>
  api.post('/auth/register', { username, password });

export const loginUser = (username, password) =>
  api.post('/auth/login', { username, password });

// Vehicle API calls
export const getVehicles = () => api.get('/vehicles');

export const searchVehicles = (query) => api.get(`/vehicles/search?q=${query}`);

export const createVehicle = (vehicleData) => api.post('/vehicles', vehicleData);

export const updateVehicle = (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData);

export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

export const purchaseVehicle = (id, quantity = 1) => api.post(`/vehicles/${id}/purchase`, { quantity });

export const restockVehicle = (id, quantity) =>
  api.post(`/vehicles/${id}/restock`, { quantity });

// Purchase API calls
export const getMyPurchases = () => api.get('/purchases/my-garage');

// Admin API calls
export const getAdminStats = () => api.get('/admin/stats');

export const getAdminPurchaseHistory = () => api.get('/admin/purchase-history');

export const getAdminUsers = () => api.get('/admin/users');

export const getAdminUserDetails = (id) => api.get(`/admin/users/${id}`);

export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);

export default api;
